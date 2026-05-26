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
