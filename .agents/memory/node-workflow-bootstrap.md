---
name: Node workflow bootstrap
description: Environment note for the invitation's Node-based preview workflow.
---

The Node preview workflow depends on the project's declared npm packages being installed in the workspace before the workflow is restarted.

**Why:** A workflow can be configured correctly yet fail immediately when its `node_modules` directory has not been populated.

**How to apply:** When a Node workflow reports a missing declared package, install the package set through the workspace package tooling, then restart the existing workflow and inspect its logs.