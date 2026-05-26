## 10. Reference Model

KAL references are explicit and scope-prefixed.

Basic examples:

```text
inputs.env
locals.version
outputs.changed
globals.shared_value
```

Rules:

- references must begin with an explicit scope prefix
- deeper path access is supported for structured runtime values
- index access is supported
- bare identifiers are not valid general references
- `globals.*` references require a matching `globals` access declaration in the current component
- `loop.*` references are only valid inside loop-provided scopes such as `core.each`

Examples:

```text
locals.release.version
locals.items[0].name
outputs.results[0].changed
globals.shared.value
```

Current canonical scalar example forms for KDL v2 in KAL are:

```text
#true
#false
#null
```

Bare `true`, `false`, and `null` should not be used as canonical KAL scalar examples.

---
