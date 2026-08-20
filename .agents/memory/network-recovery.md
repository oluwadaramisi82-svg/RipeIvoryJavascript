---
name: Network recovery
description: Reconnection behavior for guests using intermittent mobile data.
---

When connectivity returns, recover failed non-essential resources and queued activity records in place; never require a page reload for the invitation to become usable again.

**Why:** Rain and mobile-data interruptions can fail individual media or background requests while the page shell remains open. A reconnect should restore what can safely be recovered.

**How to apply:** Retry failed visual assets and local browser tools on the browser's online event, then flush queued records. Audio may be prepared again only after a guest requested it, but do not assume it can autoplay after reconnection because mobile browser policies require a fresh user interaction.