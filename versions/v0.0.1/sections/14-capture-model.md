## 14. Capture Model

`capture` is a common KAL binding syntax used at operator boundaries.

`capture` is not a general KDL operator.

It binds values from an operator's capture domain into writable caller destinations.

The universal execution outcome is distinct from the operator's capture domain. `capture` reads capture-domain source names, not `status` or `message`.

Within `capture`, `_` means the whole capture-domain object for that operator invocation.

Named sources should be used when only a specific value is needed.

### 14.1 Capture Mapping

Current mapping form:

```text
source -> destination
```

Rules:

- the left side must be either a named capture source or `_`
- the right side must be an explicit writable destination reference
- writable destinations include `locals.*`, `outputs.*`, and declared writable `globals.*`, subject to normal scope rules
- `loop.result.*` is also a writable capture destination inside a `core.each` `do` body
- `inputs.*` is not writable
- capture does not create a new reference namespace
- uncaptured results are discarded unless operator semantics say otherwise

Example:

```kdl
capture {
  result -> locals.result
  _ -> locals.full_result
}
```

### 14.2 Local Declaration Shorthand

The current draft allows capture-only local declaration shorthand:

```text
local name
```

Rules:

- `local foo` introduces a new `locals.foo` slot
- after introduction, later references use `locals.foo`
- if `locals.foo` already exists, `local foo` fails validation
- if the destination already exists, use `locals.foo`
- body-level local introduction is limited to `capture` destinations
- `local foo` is not a general write syntax
- if a local needs header-style `type` or `default` semantics, it must be declared in the component header

Example:

```kdl
capture {
  result -> local normalized_name
}
```

### 14.3 Failure Behavior

Capture writes occur only when the enclosing operator invocation completes with `status=ok`.

If an operator invocation is `skipped` or `failed`:

- its `capture` block performs no destination writes
- partial implementation-local values are not exposed
- a failed child component does not expose partial outputs to its caller

---
