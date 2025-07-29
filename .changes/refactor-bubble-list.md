---
"@matechat/react": patch:refactor
---

Rewrite auto scroll logic of `BubbleList` component:

- Use `ResizeObserver` to detect content size changes and scroll accordingly.
- Add `scrollContainer` method to scroll to bottom when content size changes.
- Introduce `pauseScroll` to prevent unnecessary scrolls during updates.
