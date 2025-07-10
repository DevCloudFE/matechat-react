---
"@matechat/react": patch:perf
---

Wrap all `useChat` hooks with `useCallback` to avoid re-rendering.
