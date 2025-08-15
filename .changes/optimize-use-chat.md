---
"@matechat/react": patch:feat
---

Optimize behavior of `useChat`:

- Add `throwOnEmptyBackend` option to `useChat` function.
- Throw an error when `backend` is nullish and `throwOnEmptyBackend` is `true`.
- Rename `isPending`to`pending` in `useChat` return value.
- Allow empty `backend` in `useChat` function.
