The Search (`search:`) discipline dictionary supplies a compact set of
high-level keywords describing what a data set is about: the science discipline
behind it, the target it observed, how the data were collected, and the research
context that produced them.

Its purpose is findability. A PDS4 archive already records a great deal of
precise, product-level detail, but very little of it answers the question a
scientist actually starts with — *"what is out there about icy moon surfaces?"*
The Search dictionary is where a data provider answers that question in the
provider's own words, once, at the level where it is true of the whole data set.

That level is the **bundle or collection label**. The dictionary is designed to
be applied to `Product_Bundle` and `Product_Collection` labels, whose
`Discipline_Area` is the natural home for a statement about the data set as a
whole. It can be applied to individual products, but doing so usually repeats
the same keywords thousands of times without making anything easier to find.

Every attribute in the dictionary is optional, repeatable, and free text. The
vocabularies shown throughout this documentation are *suggestions* — a shared
starting point that keeps independent archives using the same words for the same
ideas — not schema-enforced enumerations. If the right word for your data is not
in the list, use your word, and consider suggesting it for the next release.
