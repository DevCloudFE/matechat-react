---
"@matechat/react": patch:feat
---

Optimize `background` option of `BubbleList` component.

BREAKING CHANGES:

- Use `left-solid`, `right-solid`, `transparent` and `solid` as the value of
`background` option.
- Default to use `right-solid` as the value of `background` option in `Bubble` component.
- Remove `left-only` and `right-only` value in `Bubble` component.
