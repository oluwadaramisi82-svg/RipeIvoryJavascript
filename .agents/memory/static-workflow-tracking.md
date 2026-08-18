---
name: Static workflow tracking
description: Workflow configuration guidance for static-web-server artifacts whose preview can appear crashed without logs.
---

For static-web-server artifacts, the workflow command should use `exec static-web-server ...` in the foreground and should not redirect stdout/stderr to `/dev/null`.

**Why:** A shell wrapper with discarded output can leave the workflow manager reporting a runtime crash or no log file even while a stale child server is still serving the page, making the actual failure impossible to diagnose.

**How to apply:** When a static artifact repeatedly reports a runtime error while HTTP requests still succeed, inspect the workflow command first; make the server the directly tracked process, restart the managed workflow, and verify both its log attachment and preview.