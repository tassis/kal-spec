## 13. Operator Contract

Important operator capabilities should be schema-visible rather than left as undocumented per-operator behavior.

The current minimal abstract operator contract is:

```text
operator_id
category
placement
capture.sources
```

Recommended additional contract field:

```text
nested_body
```

Current placement values:

```text
controller
target
```

Rules:

- `operator_id` identifies the operator kind, for example `core.assign`, not an optional human-readable invocation label such as `"Bind values"`
- `placement` is mandatory because operator execution semantics are incomplete without it
- `external` is not part of the current placement surface
- `nested_body` defaults to `false` when omitted
- execution-context differences should be modeled as distinct operators rather than a runtime mode switch when those differences affect semantics

KAL defines required abstract operator-schema semantics, not a concrete manifest format, registry format, or serialization format.

### 13.1 Execution Outcome

Every operator invocation has a language-level execution outcome:

```text
status: ok | skipped | failed
message?: string
```

The execution outcome is language-level semantics. It is not a user-visible scope and not a runtime storage model.

Semantics:

- `ok` means the operator invocation completed successfully
- `skipped` means the operator invocation was not executed because execution semantics skipped it, for example due to `when`
- `failed` means the operator invocation did not complete successfully
- `message` is optional human-readable text
- `message` does not imply a machine-readable error structure
- workflow logic must not depend on `message` contents
- universal boolean mirrors such as `ok=true`, `failed=true`, or `skipped=true` are not part of the current draft
- runtime/internal execution errors map to `status=failed`
- partial failed results are not workflow-visible through `capture` or other language-level dataflow

The execution outcome is distinct from the operator capture domain.

`status` and `message` are not normal capture sources.

KAL does not define a universal composite `changed` aggregation rule.

Composite operators do not automatically expose `changed` merely because nested operators or iterations expose `changed`.

If an operator provides a change-like result, it must define that result explicitly as part of its own capture domain.

### 13.2 Capture Sources

`capture.sources` is part of the abstract operator contract.

It is not author-facing DSL syntax.

`capture.sources` is a flat mapping from named capture source to shallow type.

Current shallow types:

```text
string
number
boolean
object
array
any
```

Rules:

- `_` is language-level whole-domain shorthand and is not a `capture.sources` field
- universal execution outcome fields such as `status` and `message` are not part of `capture.sources`
- `changed` is not universal
- if an operator provides `changed`, it appears as a normal named source with type `boolean`
- capture sources may be static-provided or analyzable-derived
- static-provided sources are fixed by the operator contract
- analyzable-derived sources are resolved from analyzable targets such as invoked component outputs or parsed data-document keys

---
