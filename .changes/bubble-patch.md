---
"@matechat/react": patch:feat
---

Add loading animation during AI request wait states.

- Updated `BubbleListProps` and `Bubble` in `bubble.tsx` to support pending states
- Modified `useChat` in `chat.ts` to set `pending = true` before API requests
