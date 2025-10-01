import clsx from 'clsx';
import type React from 'react';
import { useCallback } from 'react';
import themeIcon from './assets/theme.svg';

function ThemeToggle({
  className,
  ...props
}: React.ComponentPropsWithRef<'button'>) {
  const toggleTheme = useCallback(() => {
    const docEle = document.documentElement;
    if (docEle.classList.contains('dark')) {
      docEle.classList.remove('dark');
    } else {
      docEle.classList.add('dark');
    }
  }, []);

  return (
    <button
      type="button"
      className={clsx(
        'p-2 bg-transparent hover:bg-white/23 rounded-lg cursor-pointer',
        className,
      )}
      onClick={toggleTheme}
      {...props}
    >
      <img alt="theme icon" src={themeIcon} className="w-5 h-5" />
    </button>
  );
}

export default ThemeToggle;
