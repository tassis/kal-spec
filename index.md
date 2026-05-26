---
layout: home

hero:
  name: KAL Specification
  text: Versioned drafts of the KAL core language
  tagline: Structured, analyzable workflow language documentation with monolithic and sectioned views.
  actions:
    - theme: brand
      text: Read v0.0.1
      link: /versions/v0.0.1/
    - theme: alt
      text: Browse Sections
      link: /versions/v0.0.1/sections/
    - theme: alt
      text: Open all.md
      link: /versions/v0.0.1/all

features:
  - title: Versioned
    details: Each draft is tracked under its own version directory with stable entry points.
  - title: Sectioned
    details: Top-level chapters are split into dedicated files for easier review, linking, and iteration.
  - title: Monolithic
    details: A full all-in-one snapshot is preserved for holistic reading and diff-based review.
---

<br/>
<br/>

# KAL Specification

This repository contains versioned drafts of the KAL language specification.

## Repository Layout

- `versions/`: versioned specification documents
- `versions/<version>/README.md`: version-local index
- `versions/<version>/all.md`: monolithic version snapshot
- `versions/<version>/sections/`: sectioned specification files

## Version Index

| Version | Status | Index | Monolithic | Notes |
|---|---|---|---|---|
| `v0.0.1` | Early draft | [`versions/v0.0.1/`](versions/v0.0.1/) | [`versions/v0.0.1/all.md`](versions/v0.0.1/all.md) | Initial KAL core language draft |

## Notes

- Section files are split by top-level spec chapters.
- The monolithic file is kept as a complete snapshot for review and diffing.
