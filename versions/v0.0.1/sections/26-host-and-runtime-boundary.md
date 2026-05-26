## 26. Host and Runtime Boundary

KAL core defines language-level workflow semantics. It does not define the full execution environment.

This section summarizes concerns intentionally left to the host, runtime, toolchain, standard library, extension specifications, or adjacent project specifications.

### 26.1 Component Identity and Packaging

- component identity is host-defined
- document-to-component lookup is host-defined
- multi-document project organization is host- or toolchain-defined
- package layout, registry layout, and user-facing selection models are outside KAL core

### 26.2 Reference Syntax and Resolution

- concrete reference syntax is host-defined
- lookup mechanisms are host-defined
- filesystem layout, path aliases, namespaces, registry lookup, and dependency resolution are outside KAL core
- KAL core defines required semantic targets and validation behavior after resolution, not how resolution is performed

### 26.3 Runtime Execution Environment

- concrete runtime execution behavior is outside KAL core
- controller/target process topology is not defined here beyond operator placement semantics
- transport, persistence, reporting, inventory, and secrets concerns are outside this specification

### 26.4 Global Value Provisioning

- `globals` access declarations are part of KAL core
- the source of global values is host/runtime-defined
- global lifetime, initialization, refresh, synchronization, storage, and injection are host/runtime-defined
- KAL core does not define what concrete values are made available through `globals`

### 26.5 Concurrency and Parallelism

- component bodies execute sequentially by default in KAL core
- KAL core does not define parallel component-body execution
- if a host/runtime introduces parallel execution, it is responsible for defining or rejecting concurrent shared-state behavior
- concurrent writes to shared state are not resolved by KAL core

### 26.6 Operator Libraries and Extensions

- KAL core defines operator categories and common contract expectations
- non-core operator behavior is left to host, standard-library, or extension specifications
- extension operator behavior is outside this core specification
- change-like results such as `changed` are operator-defined rather than universal language features

### 26.7 Data Document Mapping

- `core.load_vars` requires the resolved data document to expose an object-shaped capture domain
- KAL core does not define the concrete surface mapping from a host data document format to that object domain
- analyzable keys may become capture sources when the host/toolchain can derive them
- the exact document format, parsing policy, and key-mapping model are host/toolchain-defined

### 26.8 Runtime Responsibilities Summary

In short, KAL core defines:

```text
workflow structure
scope and dataflow semantics
component composition rules
core operator semantics
validation expectations
```

The host/runtime/toolchain defines:

```text
how documents are found
how components are identified
how references resolve
how globals are provisioned
how vars documents are mapped
how non-core operators behave
how runtime execution is concretely hosted
```
