## 6. Scope Model

KAL uses explicit scoped data flow.

The current model is:

```text
inputs go down
outputs go up
locals stay local
globals are shared but must be declared
```

Each component owns its own `inputs`, `locals`, and `outputs` scope.

A child component cannot implicitly read the parent's locals.

A parent component cannot directly read the child's locals.

Normal cross-component data flow must use:

```text
caller inputs -> callee inputs
callee outputs -> caller capture destination
```

`globals` provides an explicit shared scope for values that must be visible across component boundaries. It is not an implicit variable bag.

### 6.1 Inputs

`inputs` declare values required or accepted by a component.

Rules:

- inputs must be declared before use
- inputs are required by default
- inputs may define scalar or supported KAL string literal default values
- inputs may declare primitive type annotations
- input declarations use the same declaration-property style as other header declarations in the current draft
- input defaults are applied at component invocation time
- `inputs.*` is readable by the owning component
- `inputs.*` is not writable

Canonical examples:

```kdl
inputs {
  env type=string
  retries type=number default=3
}
```

### 6.2 Locals

`locals` declare component-local working values.

Rules:

- locals must be declared before general use
- locals may define scalar or supported KAL string literal default values
- locals may declare primitive type annotations
- local declarations use the same declaration-property style as input declarations in the current draft
- local defaults bind during component startup/setup
- locals are not visible to parent or child components unless explicitly passed through inputs or outputs
- `locals.*` is readable and writable by the owning component
- reading a local without an assigned value or bound default fails

Canonical examples:

```kdl
locals {
  normalized_name type=string
  retries type=number default=3
}
```

### 6.3 Outputs

`outputs` declare public result slots exported by a component.

Rules:

- outputs do not define default values
- outputs may declare primitive type annotations
- outputs may be read and written by the owning component during execution
- reading an output is valid only after that output has been assigned a value in the current component execution
- if an output is read before assignment and that read is statically knowable, validation fails
- otherwise, reading an output before assignment fails when evaluated
- outputs may be written explicitly more than once
- a successfully completed component must provide a final value for every declared output
- if a missing final output is statically knowable, validation fails
- otherwise, component completion fails if any declared output remains unset
- after successful component completion, final output values become immutable and visible to the caller through `capture`
- outputs become visible to the caller only after the component ends

When authors want to guarantee output presence across conditional branches, they may use an unconditional initial write before guarded writes that may override it.

A failed child component does not expose partial outputs to its caller.

### 6.4 Globals

`globals` is an explicit shared scope for values that must be visible across component boundaries.

A component may read or write a global value only if it declares that global key in its component header.

`globals` declarations are access declarations. They do not define how global values are created, stored, injected, refreshed, persisted, synchronized, or transported.

The concrete source, lifetime, initialization, and runtime behavior of global values are host/runtime responsibilities.

KAL core defines global access permission, not concurrent write conflict resolution.

If a host introduces parallel execution, it must define deterministic global write behavior or reject unsafe concurrent writes.

`globals` is not an implicit variable bag. Undeclared `globals.*` references fail validation.

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

  globals {
    shared_value type=string access=read
    run_marker type=boolean access=write
    shared_result type=object access=readwrite
  }
}
```

Rules:

- every component that reads or writes a global key must declare that key
- a `globals` declaration is an access declaration, not an ownership declaration
- read access is required to read a global key
- write access is required to write a global key
- `readwrite` grants both read and write access
- duplicate declarations of the same global key across resolved components must use compatible types
- mismatched duplicate global key types fail validation when analyzable
- `globals.*` may be a writable destination only when declared writable
- successful writes to `globals.*` follow normal execution order
- `globals` should not replace ordinary `inputs` / `outputs` for normal component dataflow

Current access values:

```text
read
write
readwrite
```

KAL defines the `globals` access model. It does not define what values a host/runtime provides through `globals`.

### 6.5 Type Model

The current core type surface is shallow.

Current declared types are:

```text
string
number
boolean
object
array
any
```

Rules:

- `number` represents KAL numeric values without distinguishing integer and float in core
- `object` and `array` are structured runtime value categories
- `any` disables static type narrowing but does not bypass reference, declaration, or writability validation
- unknown type names fail validation

---
