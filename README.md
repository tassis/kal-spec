# KAL Specification

This repository contains versioned drafts of the KAL language specification.

The primary documentation landing page for the site build is [`index.md`](index.md).

## Repository Layout

- `index.md`: site homepage source
- `versions/`: versioned specification documents
- `versions/<version>/index.md`: version homepage source
- `versions/<version>/all.md`: monolithic version snapshot
- `versions/<version>/sections/`: sectioned specification files

## Version Index

| Version | Status | Index | Monolithic | Notes |
|---|---|---|---|---|
| `v0.0.1` | Early draft | [`versions/v0.0.1/`](versions/v0.0.1/) | [`versions/v0.0.1/all.md`](versions/v0.0.1/all.md) | Initial KAL core language draft |

## Notes

- Section files are split by top-level spec chapters.
- The monolithic file is kept as a complete snapshot for review and diffing.
- `README.md` files are kept concise for repository browsing; detailed web indexes live in `index.md` files.

## Cloudflare Pages

This repository can be deployed as a static site on Cloudflare Pages.

- Package manager: `npm`
- Build command: `npm run docs:build`
- Build output directory: `.vitepress/dist`
- Node version: current LTS is recommended

The site is configured for straightforward static deployment from `.vitepress/dist`.
