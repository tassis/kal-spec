## 16. `core.use`

`core.use` composes a plan-facing recipe into a plan.

Conceptually:

```text
core.use = compose a recipe into a plan
```

Allowed caller:

```text
plan
```

Allowed target:

```text
recipe
```

`core.use` must not target:

```text
plan
fragment
```

`core.use` must not be called from:

```text
recipe
fragment
```

Example:

```kdl
core.use "Prepare service" {
  recipe "prepare-service"

  inputs {
    env inputs.env
  }

  capture {
    result -> locals.prepare_result
  }
}
```

### 16.1 Reference Semantics

The `recipe` field contains a host-resolved recipe reference.

KAL defines only the semantic requirement:

```text
the reference must resolve to exactly one recipe component
```

The concrete reference form and resolution mechanism are host-defined.

If the recipe reference cannot be resolved, resolves ambiguously, or resolves to a non-recipe component, validation must fail.

### 16.2 Input Binding

`core.use` passes values into the recipe through an explicit `inputs` block.

Recipe inputs are not implicitly read from the caller.

The caller must bind required recipe inputs unless defaults exist.

Bindings for undeclared recipe input keys fail validation.

Extra caller-provided inputs are not allowed in the current draft.

### 16.3 Capture Behavior

Recipe outputs are not merged implicitly into caller scope.

Recipe output names become `core.use` capture sources.

Caller-side result handling uses the common `capture` model.

Uncaptured recipe outputs are discarded.

### 16.4 Composition Rule

A plan is the only layer that composes recipes.

This ensures that high-level workflow structure remains visible at the plan level.

---
