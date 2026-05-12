---
"@matechat/react": "patch:fix"
---

Fix CodeBlock copy button: await clipboard.writeText() Promise and only show "Copied" on success, clear the reset timer on unmount to avoid memory leaks.
