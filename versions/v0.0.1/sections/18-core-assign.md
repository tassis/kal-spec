## 19. `core.assign`

`core.assign` is a core data operator for explicit scoped value binding.

It uses `bind` entries.

Each `bind` entry has the form:

```text
bind <source> to=<destination>
```

`core.assign` does not evaluate general expressions.

### 19.1 Source Values

The `source` side may be:

- a scalar literal
- a string literal, interpreted according to the KAL string model
- a readable KAL reference

The `source` side must not be:

- a general expression
- a function call
- an operator invocation
- an undeclared reference

### 19.2 Destinations

The `destination` side must be an explicit writable destination reference.

Writable destinations include:

- `locals.*`
- `outputs.*`
- `globals.*`, when declared writable
- `loop.result.*`, inside a `core.each` `do` body

`inputs.*` is not writable.

`loop.<as-name>` and `loop.meta.*` are not writable.

### 19.3 Evaluation and Commit

`bind` entries are evaluated sequentially in document order.

Bindings are evaluated against a staged write set for that `core.assign` invocation.

Later `bind` entries may read staged values produced by earlier `bind` entries in the same `core.assign` invocation.

If every binding succeeds, all staged writes commit together atomically.

If any binding fails, all staged writes from that `core.assign` invocation are discarded.

If the same destination is assigned more than once, the last successful binding in document order determines the committed value.

### 19.4 Type Validation

If a destination declares a type and the assigned value is statically known to be incompatible, validation fails.

If compatibility depends on a runtime value, assignment fails when evaluated.

### 19.5 Capture

`core.assign` does not define standard capture sources in the current draft.

It still participates in normal operator execution semantics, including `when` guards and language-level execution outcome.

Example:

```kdl
core.assign "Bind values" {
  bind inputs.name to=locals.name
  bind #true to=locals.enabled
  bind "service-${inputs.name}" to=locals.label
  bind locals.name to=outputs.result
}
```

Quoted strings, multi-line strings, raw strings, and raw multi-line strings may be used as string literal source values when supported by the KAL string model.

---
