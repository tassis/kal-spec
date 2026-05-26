## 24. Current Core Model Summary

KAL component document:

```text
KAL Component Document
  = Component Header
  + Operator Body
```

Component header:

```text
plan | recipe | fragment
```

Header sections:

```text
inputs
locals
outputs
globals
```

Scope model:

```text
inputs go down
outputs go up
locals stay local
globals are shared but must be declared
```

Operator body:

```text
Composite Operators
Data Operators
Action Operators
```

Core composition:

```text
core.use
  compose a recipe into a plan
  caller: plan
  target: recipe

core.splice
  invoke a fragment subroutine
  caller: plan / recipe / fragment
  target: fragment
```

Core data movement:

```text
core.assign
  bind source values to writable scoped destinations

core.load_vars
  load a host-defined KDL v2 vars document through explicit capture

capture
  bind operator capture-domain values to writable scope destinations
```

Core control:

```text
core.each
  sequential iteration with ordered results

when
  structured execution guard
```

---
