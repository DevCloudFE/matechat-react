import { useEffect, useState } from "react";

export const useTheme = () => {
  const [isDark, setDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  console.log(isDark);

  return { isDark };
};
