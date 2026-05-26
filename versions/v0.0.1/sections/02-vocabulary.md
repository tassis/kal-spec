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
