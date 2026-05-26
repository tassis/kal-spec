## 23. Structured Runtime Values and Inline Literals

KAL permits structured runtime values, including array-like and object-like values, as semantic values.

References may use deeper path access and index access against structured values where such values are produced by inputs, captures, operators, loops, loaded data, or globals.

The current draft does not define a canonical inline surface-literal syntax for authoring array or object values directly in KAL documents.

Spec examples should therefore avoid presenting inline array or object literals as canonical KAL syntax.

Examples should prefer:

- scalar literals
- explicit references
- capture mappings
- operator and component body structures whose KDL v2 reading is clear

Structured runtime values remain valid in KAL semantics even though direct inline literal authoring is intentionally non-canonical in the current draft.

---
