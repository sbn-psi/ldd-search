export function formatDisplayName(value: string | string[]): string {
  if (!value) return '';
  if (Array.isArray(value)) {
    return value.map(v => formatDisplayName(v)).join(', ');
  }
  return value
    .split('_')
    // .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
} 