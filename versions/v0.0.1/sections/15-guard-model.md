## 15. Guard Model

`when` is a universal execution guard.

It is a structured guard, not a full arbitrary boolean expression language.

Current direction:

- a single-condition guard may use inline form
- multi-condition guards use block form with `all` or `any`
- `check` is the predicate clause used inside block-form guards
- inline `when` and block-form `check` use the same predicate set

### 15.1 Inline Form

Inline form:

```text
when <left-operand as required by predicate> <predicate> [right-operand as required by predicate]
```

Rules:

- inline `when` begins with the predicate's required left operand
- the left operand must be an explicit KAL reference for `exists`, `empty`, `not_empty`, `is`, `is_not`, `contains`, `>`, `>=`, `<`, and `<=`
- the left operand for `in` may be a scalar literal, a string literal, or a readable KAL reference
- inline `when` contains exactly one predicate clause
- operand presence is determined by predicate arity
- inline `when` does not support composition
- inline `when` does not support nesting
- inline `when` does not support wrapper negation
- `&&`, `||`, and `!` are not part of the current `when` surface

Examples:

```kdl
when inputs.enabled is #true
when inputs.count >= 1
when inputs.name not_empty
```

### 15.2 Block Form

A `when` block contains one root condition group.

A condition group is either `all` or `any`.

An `all` or `any` group may contain:

- `check` predicate clauses
- nested `all` groups
- nested `any` groups

Block form uses:

```text
when
  all
  any
  check
```

Example:

```kdl
when {
  all {
    check inputs.enabled is #true

    any {
      check inputs.env is "prod"
      check inputs.env is "staging"
    }
  }
}
```

Group-level `not` is not part of the current draft.

### 15.3 Predicate Set

Current predicate set:

```text
is
is_not
exists
empty
not_empty
contains
in
>
>=
<
<=
```

Predicate forms:

| Predicate | Form |
|---|---|
| `exists` | `<reference> exists` |
| `empty` | `<reference> empty` |
| `not_empty` | `<reference> not_empty` |
| `is` | `<reference> is <value>` |
| `is_not` | `<reference> is_not <value>` |
| `contains` | `<container> contains <item>` |
| `in` | `<item> in <container>` |
| `>` / `>=` / `<` / `<=` | `<reference> <predicate> <value>` |

Rules:

- `exists`, `empty`, and `not_empty` do not take a value operand
- `is`, `is_not`, `contains`, `in`, `>`, `>=`, `<`, and `<=` require a value operand
- a predicate value operand may be a scalar literal, a string literal, or a readable KAL reference
- predicate value operands must not be function calls, general expressions, operator invocations, or inline object/array literals
- forms such as `when inputs.name exists #true` fail validation

Direction:

- `is` and `is_not` are equality predicates
- `==` and `!=` are not part of the current `when` surface
- `contains` is read as `<container> contains <item>`
- `in` is read as `<item> in <container>`

---
