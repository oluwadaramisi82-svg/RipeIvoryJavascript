---
name: Offline QR assets
description: Why QR generation assets must remain local for reliable guest access on weak connections.
---

Keep the QR encoder and ZIP helper as same-site, cacheable browser assets rather than relying on a third-party CDN.

**Why:** A live third-party QR browser bundle was unavailable during setup, and guests on weak or intermittent connections should not lose QR generation because an optional CDN is slow or down.

**How to apply:** When changing the QR implementation, preserve an offline-capable local browser bundle and include it in the invitation service worker’s core cache. Treat vendor bundle updates as a coordinated cache-version update.