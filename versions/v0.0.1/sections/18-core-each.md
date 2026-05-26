## 18. `core.each`

`core.each` is the current core iteration composite.

It evaluates an input collection sequentially and executes a nested operator body once for each item.

The `in` operand must evaluate to an `array` value.

Objects and strings are not iterable by `core.each` in the current draft.

Object iteration is not part of the current draft.

### 18.1 Iteration Semantics

Iterations execute sequentially in input iteration order.

The `as` clause defines the current item name under the `loop.*` scope.

Example:

```kdl
core.each "Process items" {
  in inputs.items
  as item

  do {
    core.assign "Record item" {
      bind loop.item to=loop.result.value
    }
  }

  capture {
    results -> locals.item_results
  }
}
```

In this example, `loop.item` is the current item for each iteration.

### 18.2 Loop Scope

Inside the `do` body, `core.each` provides a `loop.*` scope.

The current draft defines:

```text
loop.<as-name>
loop.result.*
loop.meta.index
```

`loop.<as-name>` is the current item.

`loop.meta.index` is the zero-based index of the current iteration.

`loop.result.*` is a reserved writable result object for the current iteration.

Fields under `loop.result.*` are created by assignment and do not require prior declaration.

Nested operators inside the `do` body may write to `loop.result.*` either through `capture` destinations or through direct writable destinations such as `core.assign`.

`locals.*` remains the enclosing component's local scope. It is not automatically materialized into loop results.

### 18.3 Results

`core.each` exposes one guaranteed capture source:

```text
results
```

`results` is an ordered `array` value.

Each `results` entry corresponds to one iteration in input order.

Each entry is the materialized value of that iteration's `loop.result` object.

If an iteration does not write any `loop.result.*` fields, its result entry is an empty object.

`results` does not automatically include diagnostics, execution traces, component locals, or unrelated working values.

### 18.4 Failure Semantics

`results` is exposed only when the whole `core.each` invocation completes successfully.

If an iteration fails, the `core.each` invocation fails. Its `capture` block performs no writes, and partial results from earlier successful iterations are not exposed through `capture`.

### 18.5 Nested Body

`core.each` is the only controlled nested operator-body form defined in the current draft.

The `do` block contains the nested operator body executed for each iteration.

---
