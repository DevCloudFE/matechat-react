import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export type SelectOptionsType = SelectOption[] | OptionGroup[];

export interface SelectOption {
  label?: string;
  value?: any;
  className?: string;
  [key: string]: any;
}

export interface OptionGroup {
  label?: string;
  code?: string;
  [key: string]: any;
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
  onSelected?: (value: any) => void;
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
    <div
      data-solt="list-item"
      key={option[optionValue] ?? option[optionLabel]}
      className={twMerge(
        clsx(
          "cursor-pointer px-4 py-2 text-sm hover:bg-blue-300",
          value === option[optionValue] && "bg-blue-500 font-semibold"
        )
      )}
      onClick={() => onSelected?.(option[optionValue])}
    >
      {option[optionLabel]}
    </div>
  );

  const renderGroup = (group: OptionGroup) => {
    const children = (group?.[optionGroupChildren] as SelectOption[]) ?? [];

    return (
      <div key={group[optionGroupLabel] ?? group.code}>
        <div
          data-solt="list-label"
          className="px-3 py-2 bg-gray-100 font-medium text-sm flex items-center gap-2"
        >
          {optionGroupTemplate ? (
            optionGroupTemplate(group)
          ) : (
            <>{group[optionGroupLabel]}</>
          )}
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
