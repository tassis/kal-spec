## 22. Validation Model

KAL validation should distinguish parsing, static analysis, and runtime-value checks.

Parsing handles malformed surface syntax.

Static analysis is the primary validation stage for KAL semantics that can be determined before execution.

KAL validation is expected to cover at least:

- exactly one component header per KAL component document
- missing required final output values where analyzable
- component header shape
- allowed header sections
- declared scope references
- input, local, output, and global read/write rules
- invalid references to undeclared scope slots
- invalid `globals.*` access without matching declaration
- invalid `globals.*` access mode
- mismatched global key types where analyzable
- composition rule violations
- composition cycles
- invalid `core.use` caller or resolved target kind
- invalid `core.splice` caller or resolved target kind
- unresolved or ambiguous core references before execution
- missing required inputs where analyzable
- extra inputs passed to a component where analyzable
- capture-source existence where analyzable
- capture destination writability
- capture destination declaration rules
- analyzable type mismatches
- malformed `when` predicates
- invalid interpolation syntax
- invalid interpolation reference syntax
- invalid `core.each` loop binding or loop-scope usage
- invalid `core.assign` bind source or destination shape
- invalid `core.load_vars` source document or source shape where analyzable

Runtime-value checks should be limited to conditions that depend on values not fully knowable before execution.

Runtime failure is not the intended normal validation stage for analyzable `core.use`, `core.splice`, or `core.load_vars` mismatches.

### 22.1 Validation Edge Cases

Important current edge-case rules include:

- reading an unassigned `locals.*` or `outputs.*` value fails validation when statically knowable, otherwise fails when evaluated
- successful component completion with any declared output still unset fails validation when statically knowable, otherwise component completion fails
- duplicate destination writes in a single `core.assign` invocation are allowed; the last successful binding in document order determines the committed value
- capture to an undeclared local fails validation unless it uses the explicit `local <name>` shorthand
- predicate arity mismatches such as `when inputs.name exists #true` fail validation
- input binding keys must match declared component inputs
- extra inputs passed to a component are not allowed in the current draft

This keeps component interfaces explicit. The current draft does not define an open-ended input-object mode for `core.use` or `core.splice`.

---
