## 21. Core Execution Order

By default, entries in a component body execute sequentially in document order.

A component body does not imply parallel execution, deferred execution, or automatic reordering unless a core composite operator explicitly defines such behavior.

A composite operator may define explicit nested execution semantics for its own body.

Later operators may depend on values captured or written by earlier operators.

Conditional follow-up behavior can be expressed by capturing prior results and guarding later operators with `when`.

Successful writes to writable scopes follow normal execution order.

---
