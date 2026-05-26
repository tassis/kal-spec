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
