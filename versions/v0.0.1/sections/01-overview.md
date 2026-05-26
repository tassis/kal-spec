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
