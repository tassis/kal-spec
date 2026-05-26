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
