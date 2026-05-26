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
