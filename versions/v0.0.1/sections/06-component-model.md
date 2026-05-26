## 7. Component Model

KAL defines three component kinds:

```text
plan
recipe
fragment
```

All three component kinds may contain an operator body.

Their difference is semantic role and composition permission, not basic ability to contain operators.

### 7.1 Plan

A `plan` is a top-level executable workflow entrypoint.

A plan represents a full workflow that a user intends to run.

A plan may:

- use recipes through `core.use`
- splice fragments through `core.splice`
- contain operators directly

A plan must not use another plan.

Example:

```kdl
plan {
  inputs {
  }

  locals {
  }

  outputs {
  }
}
```

Allowing operators directly inside a plan keeps simple automation easy. Recipes and fragments are organizational tools; they should improve structure and reuse, but they should not be mandatory for every small workflow.

### 7.2 Recipe

A `recipe` is a plan-facing semantic workflow unit.

A recipe represents a reusable workflow operation that should be visible at the plan composition level.

A recipe may:

- contain operators directly
- splice fragments through `core.splice`

A recipe must not:

- use another recipe
- use a plan

Recipes are reusable workflow units for plans, but recipes should not secretly orchestrate other recipes. If multiple recipes need to be composed together, that composition should happen at the plan level.

Example:

```kdl
recipe {
  inputs {
    env
  }

  locals {
    result
  }

  outputs {
    result
  }
}

core.splice "Run internal phase" {
  fragment "prepare-service-phase"

  inputs {
    env inputs.env
  }

  capture {
    result -> outputs.result
  }
}
```

In short:

```text
Recipe = plan-facing semantic workflow unit
```

### 7.3 Fragment

A `fragment` is a splice-only implementation subroutine.

A fragment can contain meaningful workflow implementation, but it does not have recipe-like public execution identity.

A fragment has its own scoped interface through `inputs`, `locals`, `outputs`, and optional `globals` access declarations.

A fragment may:

- contain operators directly
- splice other fragments through `core.splice`

A fragment must not:

- use recipes
- use plans
- be targeted by `core.use`
- be executed independently as a formal run target

A fragment may only be invoked through `core.splice`.

Example:

```kdl
fragment {
  inputs {
    env
  }

  locals {
    result
  }

  outputs {
    result
  }
}

core.assign "Expose result" {
  bind inputs.env to=outputs.result
}
```

In short:

```text
Fragment = internal workflow subroutine
```

---
