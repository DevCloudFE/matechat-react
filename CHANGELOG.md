# Changelog

## \[0.1.0-alpha.6]

### Bug Fixes

- [`8044b1e`](https://github.com/DevCloudFE/matechat-react/commit/8044b1eed9defb6f195cf715bd8c2321ad41be1d) ([#30](https://github.com/DevCloudFE/matechat-react/pull/30) by [@Raven-Book](https://github.com/DevCloudFE/matechat-react/../../Raven-Book)) adjust title/description font-size to match the prompt component

## \[0.1.0-alpha.5]

### New Features

- [`31f4edf`](https://github.com/DevCloudFE/matechat-react/commit/31f4edf5b24d7488ad3049e40eeca081593f9939) ([#31](https://github.com/DevCloudFE/matechat-react/pull/31)) Add `FileUpload` component for file selections.
- [`4e2905b`](https://github.com/DevCloudFE/matechat-react/commit/4e2905b6e8a06e0496205f347c11732f6c18af7e) Optimize callback performance by using `useCallback`.
- [`cd8ace0`](https://github.com/DevCloudFE/matechat-react/commit/cd8ace015d070290798369768125581429c0bf49) Remove gap and margin between textarea and footer in `Sender` component.

## \[0.1.0-alpha.4]

### New Features

- [`a0b5fc8`](https://github.com/DevCloudFE/matechat-react/commit/a0b5fc8d720460ca7c6df562fbcbe3ada26805b3) ([#26](https://github.com/DevCloudFE/matechat-react/pull/26)) Add `List` component in `list.tsx` to support grouped or normal lists.

### Bug Fixes

- [`d61b43c`](https://github.com/DevCloudFE/matechat-react/commit/d61b43c178c4f6340b944b12017ff8b57ba2476d) Fix the build issue in `utils` by adding `utils/index.ts` to vite build entries.

## \[0.1.0-alpha.3]

- [`3a19451`](https://github.com/DevCloudFE/matechat-react/commit/3a19451365a39174e32a18a25685286914c48e9f) Fix the lint error on `useEffect` in `sender.tsx`.
- [`b5e4cb8`](https://github.com/DevCloudFE/matechat-react/commit/b5e4cb86ffb618ff147ca8b1133db6eb4748f5a2) Optimize the `SenderButton` component in `sender.tsx`.

  This optimization includes:

  - Add `icon` and `isSending` option to `SenderButton` component.
  - Add doc-string for `SenderButton` and `Sender` props.

## \[0.1.0-alpha.2]

- [`17b60e7`](https://github.com/DevCloudFE/matechat-react/commit/17b60e7a0db056e37fe2e34dabbda4a2c15af972) ([#23](https://github.com/DevCloudFE/matechat-react/pull/23) by [@Raven-Book](https://github.com/DevCloudFE/matechat-react/../../Raven-Book)) Add loading animation during AI request wait states.

  - Updated `BubbleListProps` and `Bubble` in `bubble.tsx` to support pending states
  - Modified `useChat` in `chat.ts` to set `pending = true` before API requests

## \[0.1.0-alpha.1]

- [`577946c`](https://github.com/DevCloudFE/matechat-react/commit/577946c3300207688c7b9927739b49536e1438a5) Optimize `background` option of `BubbleList` component.

  BREAKING CHANGES:

  - Use `left-solid`, `right-solid`, `transparent` and `solid` as the value of `background` option.
  - Default to use `right-solid` as the value of `background` option in `Bubble` component.
  - Remove `left-only` and `right-only` value in `Bubble` component.
- [`577946c`](https://github.com/DevCloudFE/matechat-react/commit/577946c3300207688c7b9927739b49536e1438a5) Bump dependencies.

## \[0.1.0-alpha.0]

- [`464fc05`](https://github.com/DevCloudFE/matechat-react/commit/464fc054724779bebe8afefa5aa37f22253bfe03) Release first pre-release with alpha tag of `@matechat/react`.
