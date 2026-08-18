---
name: Dashboard access control
description: Access-control decision for private wedding guest and QR activity.
---

The guest activity dashboard uses two gates: its private access URL and a password stored as a workspace secret. The public invitation and QR generation flow must remain usable without dashboard access.

**Why:** The dashboard contains private guest activity, while guests still need frictionless access to their invitation.

**How to apply:** Preserve both checks when adding dashboard routes, exports, or future admin views; never put the password in source code, HTML, or a URL.