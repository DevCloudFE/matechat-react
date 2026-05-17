import React from "react";
import type { SelectItemOptionsType } from "@/list";
import { List } from "@/list";

import "./tailwind.css";

export interface TriggerConfig {
  char: string;
  data: SelectItemOptionsType;
  optionLabel: string;
  optionGroupLabel?: string;
  optionGroupChildren?: string;
}

export type OnTextInject = (newText: string, newCursorPosition: number) => void;

interface SuggestionProps {
  message: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  triggerConfigs: TriggerConfig[];
  onInject: OnTextInject;
}

const useSuggestionContext = (
  message: string,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  triggerConfigs: TriggerConfig[],
) => {
  const context = React.useMemo(() => {
    const textarea = textareaRef?.current;
    if (!textarea) return null;

    const caretPositionIndex = textarea.selectionStart ?? message.length;
    let currentConfig: TriggerConfig | undefined;
    let triggerIndex = -1;
    let queryText = "";

    for (let i = caretPositionIndex - 1; i >= 0; i--) {
      const char = message[i];
      const matchedConfig = triggerConfigs.find(
        (config) => config.char === char,
      );
      if (matchedConfig) {
        currentConfig = matchedConfig;
        triggerIndex = i;
        queryText = message.slice(i + 1, caretPositionIndex);
        break;
      }
    }
    if (!currentConfig) return null;
    return {
      currentConfig,
      triggerIndex,
      queryText,
    };
  }, [message, textareaRef, triggerConfigs]);
  return context;
};
export default function Suggestion({
  message,
  textareaRef,
  triggerConfigs,
  onInject,
}: SuggestionProps) {
  const context = useSuggestionContext(message, textareaRef, triggerConfigs);

  if (!context) return null;

  return (
    <div className="absolute bottom-full left-0 w-full bg-white dark:bg-gray-50 rounded-lg shadow-amber-50 max-h-64 overflow-y-auto">
      <List
        options={context.currentConfig.data}
        optionLabel={context.currentConfig.optionLabel ?? "default value"}
        optionGroupLabel={context.currentConfig.optionGroupLabel}
        optionGroupChildren={context.currentConfig.optionGroupChildren}
        onChange={(e) => {
          const newText: string = (e.value ?? e.target.value) as string;
          onInject(newText, context.triggerIndex);
        }}
      />
    </div>
  );
}
