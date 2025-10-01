import { createOpenAIBackend } from '@matechat/react/utils/backend';
import { agent } from '@matechat/react/utils/core';
import clsx from 'clsx';
import { useState } from 'react';
import settingIcon from './assets/setting.svg';

function Settings() {
  const [isOpen, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const [token, setToken] = useState('');

  const activateChat = () => {
    agent.use(
      createOpenAIBackend({
        apiKey: token,
        baseURL: 'https://api.deepseek.com',
        model: 'deepseek-chat',
        maxTokens: 200,
        dangerouslyAllowBrowser: true,
      }),
    );
    closeModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="p-2 bg-transparent hover:bg-white/23 rounded-lg cursor-pointer"
      >
        <img alt="setting icon" src={settingIcon} className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
          <div
            className={clsx(
              'flex flex-col gap-4.5 p-6 rounded-lg bg-gradient-to-b z-10',
              'from-[#8e7ba8] via-[#9c90b0] via-30% to-[#caafc9]',
              'dark:from-[#a77693] dark:via-[#174871] dark:via-80% dark:to-[#0f2d4d]',
            )}
          >
            <span className="flex justify-center items-center text-lg font-bold">
              设置
            </span>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="请输入API"
              className="focus:outline-none border border-gray-300 w-full p-2 rounded-md"
            />
            <div className="flex justify-center gap-12">
              <button
                type="button"
                onClick={closeModal}
                className="px-2.5 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                取消
              </button>
              <button
                type="button"
                onClick={activateChat}
                className="px-2.5 py-2 rounded-md text-white bg-[#8d7ba7] hover:bg-[#8873a6]"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;
