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
