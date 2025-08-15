import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export type SelectOptionsType = SelectOption[] | OptionGroup[];

export interface SelectOption {
  label?: string;
  value?: string;
  className?: string;
  [key: string]: unknown;
}

export interface OptionGroup {
  label?: string;
  [key: string]: unknown;
}

export interface ListProps extends React.ComponentProps<"div"> {
  value: string | undefined;
  options: SelectOptionsType | undefined;
  className?: string;
  optionGroupChildren?: string;
  optionGroupLabel?: string;
  optionGroupTemplate?: (group: OptionGroup) => React.ReactNode;
  optionLabel?: string;
  optionValue?: string;
  onSelected?: (value: string) => void;
}

export function List({
  value,
  options,
  className,
  optionGroupChildren = "items",
  optionGroupLabel = "label",
  optionGroupTemplate,
  optionLabel = "label",
  optionValue = "value",
  onSelected,
  ...props
}: ListProps) {
  const renderOption = (option: SelectOption) => (
    <button
      type="button"
      tabIndex={-1}
      data-slot="list-item"
      key={
        (option[optionValue] as string | number) ??
        (option[optionLabel] as string | number)
      }
      className={twMerge(
        clsx(
          "cursor-pointer px-4 py-2 text-sm hover:bg-blue-300 block w-full text-left",
          value === option[optionValue] &&
            "bg-blue-500 hover:bg-blue-500 font-semibold",
        ),
      )}
      onClick={() => onSelected?.(option[optionValue] as string)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelected?.(option[optionValue] as string);
        }
      }}
    >
      {option[optionLabel] as React.ReactNode}
    </button>
  );

  const renderGroup = (group: OptionGroup) => {
    const children = (group?.[optionGroupChildren] as SelectOption[]) ?? [];

    return (
      <div
        key={
          (group[optionGroupLabel] as string | number) ??
          (group.code as string | number)
        }
      >
        <div
          data-slot="list-label"
          className="px-3 py-2 bg-gray-100 font-medium text-sm flex items-center gap-2"
        >
          {optionGroupTemplate
            ? (optionGroupTemplate(group) as React.ReactNode)
            : (group[optionGroupLabel] as React.ReactNode)}
        </div>
        {children.map(renderOption)}
      </div>
    );
  };

  const isGrouped =
    Array.isArray(options) &&
    options.length > 0 &&
    typeof options[0] === "object" &&
    optionGroupChildren &&
    Array.isArray(options[0][optionGroupChildren]);

  return (
    <div
      data-slot="list"
      className={twMerge(clsx("w-full max-w-xs overflow-y-auto", className))}
      {...props}
    >
      {Array.isArray(options) &&
        (isGrouped
          ? (options as OptionGroup[]).map(renderGroup)
          : (options as SelectOption[]).map(renderOption))}
    </div>
  );
}
