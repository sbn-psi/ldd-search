#!/usr/bin/env python3
"""Build Search LDD schemas for PDS IM versions used by bundle/collection labels."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from xml.etree import ElementTree as ET


PDS_NS = "http://pds.nasa.gov/pds4/pds/v1"
LEGACY_BASE_VERSION = "1.13.0.0"
LEGACY_BASE_CODE = "1D00"
CURRENT_TOOL_MIN_MINOR = 13


def im_code(version: str) -> str:
    parts = version.split(".")
    if len(parts) != 4 or parts[0] != "1":
        raise ValueError(f"Unsupported PDS information model version: {version}")
    minor_text = parts[1].upper()
    if minor_text.isdigit():
        minor = int(minor_text)
        minor_code = str(minor) if minor < 10 else chr(ord("A") + minor - 10)
    elif len(minor_text) == 1 and "A" <= minor_text <= "Z":
        minor_code = minor_text
    else:
        raise ValueError(f"Unsupported PDS information model minor version: {version}")
    if any(not value.isdigit() or len(value) != 1 for value in parts[2:]):
        raise ValueError(f"Unsupported PDS information model patch/build version: {version}")
    return f"1{minor_code}{parts[2]}{parts[3]}"


def version_minor(version: str) -> int:
    value = version.split(".")[1].upper()
    return int(value) if value.isdigit() else 10 + ord(value) - ord("A")


def version_key(version: str) -> tuple[int, int, int, int]:
    parts = version.split(".")
    return (int(parts[0]), version_minor(version), int(parts[2]), int(parts[3]))


def label_versions(labels_dir: Path, scope: str) -> list[str]:
    versions = set()
    for label in labels_dir.rglob("*"):
        if not label.is_file() or label.suffix.casefold() not in {".xml", ".lblx"}:
            continue
        is_non_mission = "non_mission" in label.parts
        if scope != "all" and (scope == "non_mission") != is_non_mission:
            continue
        root = ET.parse(label).getroot()
        product_class = root.findtext(
            f"{{{PDS_NS}}}Identification_Area/"
            f"{{{PDS_NS}}}product_class"
        )
        if product_class not in {"Product_Bundle", "Product_Collection"}:
            continue
        value = root.findtext(
            f"{{{PDS_NS}}}Identification_Area/"
            f"{{{PDS_NS}}}information_model_version"
        )
        if not value:
            raise ValueError(f"No information_model_version in {label}")
        versions.add(value.strip())
    return sorted(versions, key=version_key)


def configured_codes(lddtool: Path) -> set[str]:
    result = subprocess.run(
        [str(lddtool), "-v"], text=True, capture_output=True, check=False
    )
    output = result.stdout + result.stderr
    match = re.search(r"Configured IM Versions:\s*\[([^]]+)]", output)
    if not match:
        raise RuntimeError(f"Could not read configured IM versions from {lddtool}\n{output}")
    return {value.strip() for value in match.group(1).split(",")}


def run_lddtool(lddtool: Path, ingest: Path, version: str, output: Path) -> dict:
    code = im_code(version)
    output.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=f"search-ldd-{code}-") as temp_name:
        temp = Path(temp_name)
        result = subprocess.run(
            [str(lddtool), "-lpdJ", "-V", code, str(ingest)],
            cwd=temp,
            text=True,
            capture_output=True,
            check=False,
        )
        log = result.stdout + result.stderr
        (output / "lddtool.log").write_text(log, encoding="utf-8")
        errors = re.findall(r"^>>>\s+(?:ERROR|FATAL).*", log, flags=re.MULTILINE)
        if result.returncode != 0 or errors:
            detail = "\n".join(errors) if errors else log[-4000:]
            raise RuntimeError(f"LDDTool failed for {version} ({code}):\n{detail}")

        xsd = next(temp.glob("PDS4_SEARCH_*.xsd"), None)
        sch = next(temp.glob("PDS4_SEARCH_*.sch"), None)
        if not xsd or not sch:
            raise RuntimeError(f"LDDTool produced no Search XSD/Schematron for {version}")
        shutil.copy2(xsd, output / xsd.name)
        shutil.copy2(sch, output / sch.name)

    return {
        "information_model_version": version,
        "im_code": code,
        "provenance": "lddtool",
        "xsd": xsd.name,
        "schematron": sch.name,
    }


def adapt_legacy_schema(base_dir: Path, version: str, output: Path) -> dict:
    """Adapt 1D00 output for old cores that current LDDTool cannot target.

    Search only derives its scalar values from pds:ASCII_Short_String_Collapsed,
    which exists in these older core schemas. The generated Search class model is
    otherwise namespace-local, so changing the imported core schema is sufficient.
    """
    code = im_code(version)
    output.mkdir(parents=True, exist_ok=True)
    base_xsd = next(base_dir.glob("PDS4_SEARCH_*.xsd"))
    base_sch = next(base_dir.glob("PDS4_SEARCH_*.sch"))
    marker = (
        "  <!-- Locally adapted from LDDTool 1D00 output because current LDDTool "
        f"does not target {code}. -->\n"
    )

    def adapt(source: Path, destination: Path) -> None:
        text = source.read_text(encoding="utf-8")
        text = text.replace(f"PDS4_PDS_{LEGACY_BASE_CODE}", f"PDS4_PDS_{code}")
        text = text.replace(LEGACY_BASE_VERSION, version)
        declaration_end = text.find("?>") + 2
        text = text[:declaration_end] + "\n" + marker + text[declaration_end:].lstrip("\n")
        destination.write_text(text, encoding="utf-8")

    xsd_name = f"PDS4_SEARCH_{code}_1000.xsd"
    sch_name = f"PDS4_SEARCH_{code}_1000.sch"
    adapt(base_xsd, output / xsd_name)
    adapt(base_sch, output / sch_name)
    (output / "lddtool.log").write_text(
        f"Compatibility schema adapted from {base_xsd} for PDS IM {version}.\n",
        encoding="utf-8",
    )
    return {
        "information_model_version": version,
        "im_code": code,
        "provenance": "legacy_compatibility_from_1D00",
        "xsd": xsd_name,
        "schematron": sch_name,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lddtool", type=Path, required=True)
    parser.add_argument("--ingest", type=Path, default=Path("src/PDS4_Search_IngestLDD.xml"))
    parser.add_argument("--labels", type=Path, default=Path("bundle_labels"))
    parser.add_argument("--output", type=Path, default=Path("generated_schemas/search"))
    parser.add_argument(
        "--scope",
        choices=("mission", "non_mission", "all"),
        default="mission",
        help="Label inventory whose PDS IM versions should be built (default: mission)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    lddtool = args.lddtool.resolve()
    ingest = args.ingest.resolve()
    versions = label_versions(args.labels, args.scope)
    supported = configured_codes(lddtool)
    entries = []

    build_versions = set(versions)
    if any(
        im_code(version) not in supported or version_minor(version) < CURRENT_TOOL_MIN_MINOR
        for version in versions
    ):
        build_versions.add(LEGACY_BASE_VERSION)

    built = {}
    for version in sorted(build_versions, key=version_key):
        code = im_code(version)
        if code not in supported or version_minor(version) < CURRENT_TOOL_MIN_MINOR:
            continue
        entry = run_lddtool(lddtool, ingest, version, args.output / version)
        built[version] = entry
        if version in versions:
            entries.append(entry)

    for version in versions:
        if im_code(version) in supported and version_minor(version) >= CURRENT_TOOL_MIN_MINOR:
            continue
        base_dir = args.output / LEGACY_BASE_VERSION
        entries.append(adapt_legacy_schema(base_dir, version, args.output / version))

    entries.sort(key=lambda item: version_key(item["information_model_version"]))
    manifest = {
        "namespace": "http://pds.nasa.gov/pds4/search/v1",
        "ldd_version": "1.0.0.0",
        "ingest_ldd": str(args.ingest),
        "schemas": entries,
    }
    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Built {len(entries)} Search schema pairs in {args.output}")


if __name__ == "__main__":
    main()
