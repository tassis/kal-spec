## 11. String and Interpolation Model

KAL string handling is a KAL-layer rule rather than a native KDL string feature.

String literals used in operator bodies are interpreted according to the KAL string model.

The current draft accepts these KAL string literal forms in operator bodies:

- ordinary quoted strings
- multi-line strings
- raw strings
- raw multi-line strings

Only ordinary quoted strings and multi-line strings are interpolation-capable.

Raw strings and raw multi-line strings are treated as literal string values and do not perform `${...}` interpolation.

The current draft does not define bare identifiers as KAL string literal forms.

Declaration-time strings in component headers are not interpolated.

The only interpolation form is:

```text
${reference}
```

Rules:

- `reference` must be a valid KAL reference
- interpolation does not support expressions
- interpolation does not support function calls
- interpolation does not support nested interpolation
- `\${` means a literal `${` sequence inside an interpolation-capable string
- `${` without a matching closing `}` fails validation
- `${}` fails validation
- `${...}` whose contents are not a valid KAL reference fails validation

Current interpolation value contract:

- scalar values such as `string`, `number`, and `boolean` are valid interpolation inputs
- object and array values are not implicitly stringified
- if a non-scalar interpolation value is statically knowable, validation should fail
- otherwise, a non-scalar interpolation value fails when interpolation is attempted

Reference fields used by core document-loading or data-loading semantics must not rely on general interpolation in the current draft.

Interpolation is evaluated before the resulting string value is passed to an operator or bound by `core.assign`.

Multi-line string values follow the same interpolation model as ordinary quoted string values.

---
