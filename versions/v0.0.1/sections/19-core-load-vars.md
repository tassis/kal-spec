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
