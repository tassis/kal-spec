## 17. `core.splice`

`core.splice` invokes a fragment inside the current component.

Conceptually:

```text
core.splice = invoke a fragment subroutine
```

Allowed callers:

```text
plan
recipe
fragment
```

Allowed target:

```text
fragment
```

`core.splice` must not target:

```text
plan
recipe
```

Example:

```kdl
core.splice "Run internal phase" {
  fragment "prepare-service-phase"

  inputs {
    env inputs.env
  }

  capture {
    result -> locals.phase_result
    _ -> locals.full_phase_result
  }
}
```

### 17.1 Reference Semantics

The `fragment` field contains a host-resolved fragment reference.

KAL defines only the semantic requirement:

```text
the reference must resolve to exactly one fragment component
```

The concrete reference form and resolution mechanism are host-defined.

If the fragment reference cannot be resolved, resolves ambiguously, or resolves to a non-fragment component, validation must fail.

### 17.2 Input Binding

`core.splice` passes values into the fragment through an explicit `inputs` block.

Fragment inputs are not implicitly read from the caller.

The caller must bind required fragment inputs unless defaults exist.

Bindings for undeclared fragment input keys fail validation.

Extra caller-provided inputs are not allowed in the current draft.

### 17.3 Capture Behavior

Fragment outputs are not merged implicitly into caller scope.

Fragment output names become `core.splice` capture sources.

Caller-side result handling uses the common `capture` model.

Uncaptured fragment outputs are discarded.

Within `core.splice`, `_` means the callee's whole declared outputs object.

If the invoked fragment fails, caller-side splice capture performs no writes.

Partial callee outputs are not captured.

### 17.4 Splice Invocation Semantics

`core.splice` invokes a fragment component. It does not paste, inline, or textually include the fragment body into the caller.

The invoked fragment keeps its own component scope. Values enter the fragment through `inputs`, and declared fragment `outputs` become available to the caller only through explicit `capture`.

The caller controls where the splice invocation appears in the workflow and how captured outputs are used.

`core.splice` represents one fragment invocation. It does not define loop aggregation or multi-invocation result collection. If a fragment is invoked repeatedly by an enclosing composite operator such as `core.each`, aggregation is defined by that enclosing operator.

---
