## 5. Header Sections

The current component header sections are:

```text
inputs
locals
outputs
globals
```

All four header sections are optional.

If a component does not use `inputs`, `locals`, `outputs`, or `globals`, the unused sections may be omitted from that component header.

If all four sections are omitted, the component header may be written without a block.

In that case, bare forms such as `recipe` and empty-block forms such as `recipe {}` are semantically equivalent.

If any header section is present, the block form is required.

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

This applies equally to all four header sections. A component only declares the sections it uses.

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
