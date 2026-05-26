# KAL Core Language Specification Draft

> Status: early language draft  
> Scope: KAL core language semantics  
> Draft shape: reorganized after scope-boundary review

---

## 1. Overview

KAL is a KDL v2-based automation DSL.

Unless otherwise stated, KAL assumes KDL v2 syntax and document rules as the underlying surface format.

KAL is defined as a language and document model. It is not a runtime, product, package manager, inventory system, reporting system, or project-layout specification.

KAL describes automation workflows through:

- explicit workflow components
- scoped data flow
- composable execution units
- operator-based execution semantics
- analyzable component boundaries
- structured guards
- explicit result capture

A concise positioning statement is:

```text
A KDL-based automation DSL for scoped, explicit, composable workflow specifications.
```

KAL core defines language-level semantics only. Host-specific reference resolution, toolchain behavior, runtime execution, library operator behavior, extension operator behavior, persistence, reporting, transport, and project layout are outside this specification.

---

## 2. Core Design Principles

KAL documents are not arbitrary KDL documents. They follow a stricter component-oriented structure.

At a high level, a KAL document is composed of:

```text
component header + operator body
```

The component header declares the component kind and scope interface.

The operator body describes the workflow implementation.

KAL defines three component kinds:

```text
plan
recipe
fragment
```

Their semantic roles are:

```text
plan     = top-level executable workflow entrypoint
recipe   = plan-facing semantic workflow unit
fragment = splice-only implementation subroutine
```

The core composition principle is:

```text
Higher-level components may invoke lower-level abstractions.
Lower-level components may not invoke higher-level abstractions.
```

In shorter form:

```text
Top-down composition is permissive.
Bottom-up composition is restricted.
```

This keeps simple workflows simple while preventing lower-level reusable pieces from secretly orchestrating higher-level workflows.

---

## 3. Vocabulary

The DSL is named **KAL**.

A possible expansion is:

```text
KDL Automation Language
```

The core vocabulary is:

```text
KAL

plan
recipe
fragment
operator

inputs
locals
outputs
globals

core.use
core.splice
core.each
core.assign
core.load_vars

when
check
capture
```

The core scope model is summarized as:

```text
inputs go down
outputs go up
locals stay local
globals are shared but must be declared
```

---

## 4. Document Model

A single KAL component document contains exactly one component header and an operator body.

This rule applies to one component document.

A host or toolchain may organize multiple component documents into a project, package, registry unit, or other larger structure, but that organization is outside KAL core.

The component header is one of:

```text
plan
recipe
fragment
```

A component header declares the component kind and scope interface. It does not declare a component identity.

Component identity, if needed for execution, lookup, display, packaging, or user-facing selection, is host-defined.

The operator body is written after the component header as sibling nodes. Operators are not nested inside a generic `body` block.

Example:

```kdl
recipe {
  inputs {
    name
  }

  locals {
    normalized_name
  }

  outputs {
    result
  }
}

core.assign "Set local value" {
  bind inputs.name to=locals.normalized_name
}
```

This preserves a clear distinction:

```text
component header = interface and scope declaration
operator body    = workflow implementation
```

A generic wrapper body form is intentionally not part of the current draft:

```kdl
recipe {
  inputs {
    name
  }

  body {
    core.assign "Set local value" {
      bind inputs.name to=locals.normalized_name
    }
  }
}
```

Component bodies stay flat by default.

Composite operators may define controlled nested operator bodies, such as `core.each`.

---

## 5. Header Sections

The current component header sections are:

```text
inputs
locals
outputs
globals
```

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
  }
}
```

`globals` is optional. A component that does not use shared global values does not need a `globals` section.

### 5.1 Header Declaration Shape

A header declaration entry uses property-style declaration syntax.

Current canonical forms are:

```text
<name> type=<type>?
<name> type=<type>? default=<scalar-or-string-literal>?
<name> type=<type>? access=read|write|readwrite
```

Rules:

- declaration names must be bare identifiers
- declaration names must be unique within the same header section
- `default` is allowed for `inputs` and `locals`
- for `inputs` and `locals`, `default` may be a scalar literal or a supported KAL string literal
- inline object and array literals are not part of the current declaration-default surface
- `default` is not allowed for `outputs`
- `access` is required for `globals`
- unsupported declaration properties fail validation

---

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

## 8. Composition Rules

KAL separates three component boundaries:

```text
plan     = top-level executable workflow entrypoint
recipe   = plan-facing semantic workflow unit
fragment = splice-only implementation subroutine
```

The composition table is:

| From \ To | `plan` | `recipe` | `fragment` | operators |
|---|---:|---:|---:|---:|
| `plan` | no | `core.use` | `core.splice` | yes |
| `recipe` | no | no | `core.splice` | yes |
| `fragment` | no | no | `core.splice` | yes |

This means:

- a plan can use recipes, splice fragments, and contain operators directly
- a recipe can splice fragments and contain operators directly, but cannot use recipes
- a fragment can splice fragments and contain operators directly, but cannot use recipes
- all component kinds may contain operators directly

The key principle is:

```text
Dependency direction must go downward.
Execution composition may skip layers downward.
```

Allowed examples:

```text
Plan -> Recipe -> Fragment -> Operator
Plan -> Fragment -> Operator
Plan -> Operator
Recipe -> Fragment -> Operator
Recipe -> Operator
Fragment -> Fragment -> Operator
Fragment -> Operator
```

Disallowed examples:

```text
Plan -> Plan
Recipe -> Recipe
Recipe -> Plan
Fragment -> Recipe
Fragment -> Plan
Operator -> any component
```

Composition across `core.use` and `core.splice` must remain acyclic.

Any detected composition cycle must fail validation before execution.

---

## 9. Host-Resolved References

KAL defines document and data references at the semantic level.

Some core operators reference other KAL components or data documents.

KAL requires that these references resolve to the required semantic target before execution or before any static validation that depends on the target shape.

KAL core does not define concrete reference syntax, lookup mechanisms, filesystem layout, package layout, path aliases, registry lookup, namespace construction, dependency resolution, or shared-resource conventions. Those are host or toolchain responsibilities.

### 9.1 Reference Resolution

Core references used by `core.use`, `core.splice`, and `core.load_vars` must resolve before execution.

KAL defines the required semantic target of each reference:

- `core.use.recipe` must resolve to exactly one `recipe` component
- `core.splice.fragment` must resolve to exactly one `fragment` component
- `core.load_vars.source` must resolve to exactly one valid KDL v2 vars document

The concrete reference syntax and lookup mechanism are host-defined.

If a reference cannot be resolved, resolves ambiguously, or resolves to the wrong target kind, validation must fail.

---

## 10. Reference Model

KAL references are explicit and scope-prefixed.

Basic examples:

```text
inputs.env
locals.version
outputs.changed
globals.shared_value
```

Rules:

- references must begin with an explicit scope prefix
- deeper path access is supported for structured runtime values
- index access is supported
- bare identifiers are not valid general references
- `globals.*` references require a matching `globals` access declaration in the current component
- `loop.*` references are only valid inside loop-provided scopes such as `core.each`

Examples:

```text
locals.release.version
locals.items[0].name
outputs.results[0].changed
globals.shared.value
```

Current canonical scalar example forms for KDL v2 in KAL are:

```text
#true
#false
#null
```

Bare `true`, `false`, and `null` should not be used as canonical KAL scalar examples.

---

## 11. String and Interpolation Model

KAL string handling is a KAL-layer rule rather than a native KDL string feature.

String literals used in operator bodies are interpreted according to the KAL string model.

The current draft accepts these KAL string literal forms in operator bodies:

- ordinary quoted strings
- multi-line strings
- raw strings
- raw multi-line strings

Only ordinary quoted strings and multi-line strings are interpolation-capable.

Raw strings and raw multi-line strings are treated as literal string values and do not perform `${...}` interpolation.

The current draft does not define bare identifiers as KAL string literal forms.

Declaration-time strings in component headers are not interpolated.

The only interpolation form is:

```text
${reference}
```

Rules:

- `reference` must be a valid KAL reference
- interpolation does not support expressions
- interpolation does not support function calls
- interpolation does not support nested interpolation
- `\${` means a literal `${` sequence inside an interpolation-capable string
- `${` without a matching closing `}` fails validation
- `${}` fails validation
- `${...}` whose contents are not a valid KAL reference fails validation

Current interpolation value contract:

- scalar values such as `string`, `number`, and `boolean` are valid interpolation inputs
- object and array values are not implicitly stringified
- if a non-scalar interpolation value is statically knowable, validation should fail
- otherwise, a non-scalar interpolation value fails when interpolation is attempted

Reference fields used by core document-loading or data-loading semantics must not rely on general interpolation in the current draft.

Interpolation is evaluated before the resulting string value is passed to an operator or bound by `core.assign`.

Multi-line string values follow the same interpolation model as ordinary quoted string values.

---

## 12. Operator Model

Everything executable in KAL is modeled as an operator.

KAL uses a three-way operator classification:

```text
Operator
├── Composite Operator
├── Data Operator
└── Action Operator
```

### 12.1 Composite Operators

Composite operators compose, expand, or control workflow structure.

Core composite operators in the current draft include:

```text
core.use
core.splice
core.each
```

Composite operators do not directly represent target-side actions. Instead, they affect how components are connected, expanded, or controlled.

### 12.2 Data Operators

Data operators transform, assign, load, or move scoped data.

Core data operators in the current draft include:

```text
core.assign
core.load_vars
```

Data operators usually operate on controller-side data and interact with KAL scopes.

### 12.3 Action Operators

Action operators perform external actions against a target, controller, or external system.

KAL core defines the category and common contract shape, but does not define concrete standard-library or platform-specific action operators in this specification.

Concrete non-core operator behavior belongs to host, standard-library, or extension specifications.

---

## 13. Operator Contract

Important operator capabilities should be schema-visible rather than left as undocumented per-operator behavior.

The current minimal abstract operator contract is:

```text
operator_id
category
placement
capture.sources
```

Recommended additional contract field:

```text
nested_body
```

Current placement values:

```text
controller
target
```

Rules:

- `operator_id` identifies the operator kind, for example `core.assign`, not an optional human-readable invocation label such as `"Bind values"`
- `placement` is mandatory because operator execution semantics are incomplete without it
- `external` is not part of the current placement surface
- `nested_body` defaults to `false` when omitted
- execution-context differences should be modeled as distinct operators rather than a runtime mode switch when those differences affect semantics

KAL defines required abstract operator-schema semantics, not a concrete manifest format, registry format, or serialization format.

### 13.1 Execution Outcome

Every operator invocation has a language-level execution outcome:

```text
status: ok | skipped | failed
message?: string
```

The execution outcome is language-level semantics. It is not a user-visible scope and not a runtime storage model.

Semantics:

- `ok` means the operator invocation completed successfully
- `skipped` means the operator invocation was not executed because execution semantics skipped it, for example due to `when`
- `failed` means the operator invocation did not complete successfully
- `message` is optional human-readable text
- `message` does not imply a machine-readable error structure
- workflow logic must not depend on `message` contents
- universal boolean mirrors such as `ok=true`, `failed=true`, or `skipped=true` are not part of the current draft
- runtime/internal execution errors map to `status=failed`
- partial failed results are not workflow-visible through `capture` or other language-level dataflow

The execution outcome is distinct from the operator capture domain.

`status` and `message` are not normal capture sources.

KAL does not define a universal composite `changed` aggregation rule.

Composite operators do not automatically expose `changed` merely because nested operators or iterations expose `changed`.

If an operator provides a change-like result, it must define that result explicitly as part of its own capture domain.

### 13.2 Capture Sources

`capture.sources` is part of the abstract operator contract.

It is not author-facing DSL syntax.

`capture.sources` is a flat mapping from named capture source to shallow type.

Current shallow types:

```text
string
number
boolean
object
array
any
```

Rules:

- `_` is language-level whole-domain shorthand and is not a `capture.sources` field
- universal execution outcome fields such as `status` and `message` are not part of `capture.sources`
- `changed` is not universal
- if an operator provides `changed`, it appears as a normal named source with type `boolean`
- capture sources may be static-provided or analyzable-derived
- static-provided sources are fixed by the operator contract
- analyzable-derived sources are resolved from analyzable targets such as invoked component outputs or parsed data-document keys

---

## 14. Capture Model

`capture` is a common KAL binding syntax used at operator boundaries.

`capture` is not a general KDL operator.

It binds values from an operator's capture domain into writable caller destinations.

The universal execution outcome is distinct from the operator's capture domain. `capture` reads capture-domain source names, not `status` or `message`.

Within `capture`, `_` means the whole capture-domain object for that operator invocation.

Named sources should be used when only a specific value is needed.

### 14.1 Capture Mapping

Current mapping form:

```text
source -> destination
```

Rules:

- the left side must be either a named capture source or `_`
- the right side must be an explicit writable destination reference
- writable destinations include `locals.*`, `outputs.*`, and declared writable `globals.*`, subject to normal scope rules
- `loop.result.*` is also a writable capture destination inside a `core.each` `do` body
- `inputs.*` is not writable
- capture does not create a new reference namespace
- uncaptured results are discarded unless operator semantics say otherwise

Example:

```kdl
capture {
  result -> locals.result
  _ -> locals.full_result
}
```

### 14.2 Local Declaration Shorthand

The current draft allows capture-only local declaration shorthand:

```text
local name
```

Rules:

- `local foo` introduces a new `locals.foo` slot
- after introduction, later references use `locals.foo`
- if `locals.foo` already exists, `local foo` fails validation
- if the destination already exists, use `locals.foo`
- body-level local introduction is limited to `capture` destinations
- `local foo` is not a general write syntax
- if a local needs header-style `type` or `default` semantics, it must be declared in the component header

Example:

```kdl
capture {
  result -> local normalized_name
}
```

### 14.3 Failure Behavior

Capture writes occur only when the enclosing operator invocation completes with `status=ok`.

If an operator invocation is `skipped` or `failed`:

- its `capture` block performs no destination writes
- partial implementation-local values are not exposed
- a failed child component does not expose partial outputs to its caller

---

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

## 20. `core.load_vars`

`core.load_vars` loads a host-resolved vars document into the caller component through explicit `capture`.

A vars document is a valid KDL v2 document whose concrete format is host-defined.

The term `vars` here refers to a literal data document convention, not to a distinct KAL variable scope.

KAL defines the semantic requirements only:

- the resolved document must parse as valid KDL v2
- the resolved document must represent literal data only
- the resolved document must not contain KAL components, operators, guards, capture blocks, or workflow-control constructs
- the resolved document must be mapped by the host into an object-shaped capture domain
- analyzable top-level keys from that host-mapped object-shaped capture domain become named capture sources

The `source` field contains a host-resolved data-document reference.

KAL defines only the semantic requirement:

```text
the reference must resolve to exactly one valid KDL v2 vars document
```

The concrete reference form and resolution mechanism are host-defined.

KDL v2 does not require KAL to use one universal top-level node convention for vars documents in this specification.

The concrete document shape, root-node convention, and host-side mapping from KDL v2 surface syntax to that object-shaped capture domain are host-defined.

Rules:

- values in vars documents are literal-only
- workflow logic is not allowed in vars documents
- loaded keys should be analyzable from the host-mapped capture domain
- values are never imported implicitly into caller scope
- named capture sources correspond to top-level keys in the host-mapped capture domain
- `_` captures the whole host-mapped capture domain object
- capture destinations follow the normal writable-destination rules
- type validation applies to declared destination types when present
- missing captured keys fail validation when analyzable
- otherwise, missing captured keys fail when evaluated
- successful capture writes follow normal component body execution order

Validation of key existence for named captures is defined against the host-mapped capture domain, not directly against raw KDL surface structure.

Example:

```kdl
core.load_vars "Load environment vars" {
  source "environment-vars"

  capture {
    api_url -> locals.api_url
    retries -> locals.retries
  }
}
```

---

## 21. Core Execution Order

By default, entries in a component body execute sequentially in document order.

A component body does not imply parallel execution, deferred execution, or automatic reordering unless a core composite operator explicitly defines such behavior.

A composite operator may define explicit nested execution semantics for its own body.

Later operators may depend on values captured or written by earlier operators.

Conditional follow-up behavior can be expressed by capturing prior results and guarding later operators with `when`.

Successful writes to writable scopes follow normal execution order.

---

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

## 23. Structured Runtime Values and Inline Literals

KAL permits structured runtime values, including array-like and object-like values, as semantic values.

References may use deeper path access and index access against structured values where such values are produced by inputs, captures, operators, loops, loaded data, or globals.

The current draft does not define a canonical inline surface-literal syntax for authoring array or object values directly in KAL documents.

Spec examples should therefore avoid presenting inline array or object literals as canonical KAL syntax.

Examples should prefer:

- scalar literals
- explicit references
- capture mappings
- operator and component body structures whose KDL v2 reading is clear

Structured runtime values remain valid in KAL semantics even though direct inline literal authoring is intentionally non-canonical in the current draft.

---

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

## 25. Open Questions

No major unresolved language-shape questions are currently tracked in this core KAL draft.

Remaining refinements are expected to clarify declaration syntax, validation edge cases, canonical examples, and host/spec boundaries without changing the current intended semantics.

Host, toolchain, package, runtime, inventory, secrets, reporting, standard-library, and extension topics should be tracked in their respective specifications.
