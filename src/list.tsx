import "./tailwind.css";

import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export type UnknownRecord = Record<string, unknown>;

export type GroupData = UnknownRecord & {
  [key: string]: unknown;
};

export type OptionData = UnknownRecord & {
  [key: string]: unknown;
};

export type SelectItemOptionsType = OptionData[] | GroupData[];

interface ListChangeTargetOptions {
  name: string;
  id: string;
  value: unknown;
}

interface ListChangeEvent {
  originalEvent: React.SyntheticEvent;
  value: unknown;
  stopPropagation(): void;
  preventDefault(): void;
  target: ListChangeTargetOptions;
}

export interface ListProps
  extends Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    "onChange"
  > {
  listBoxStyle?: React.CSSProperties | undefined;
  listGroupStyle?: React.CSSProperties | undefined;
  listItemStyle?: React.CSSProperties | undefined;
  listStyle?: React.CSSProperties | undefined;
  optionGroupChildren?: string | undefined;
  optionGroupLabel?: string | undefined;
  optionLabel: string;
  options?: SelectItemOptionsType | undefined;
  value?: string | null;
  onChange?: (event: ListChangeEvent) => void;
}

interface OptionGroupItem {
  optionGroup: GroupData;
  group: boolean;
  index: number;
  label: unknown;
}

export type MixedOptionArray = Array<OptionGroupItem | OptionData>;

export const List = ({
  listBoxStyle,
  listGroupStyle,
  listItemStyle,
  listStyle,
  optionGroupChildren,
  optionGroupLabel,
  optionLabel,
  options,
  value,
  onChange,
  ...props
}: ListProps) => {
  const handleSelect = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    option: UnknownRecord,
  ) => {
    const optionValue = option[optionLabel];
    const changeEvent: ListChangeEvent = {
      originalEvent: event,
      value: optionValue,
      stopPropagation: () => event.stopPropagation(),
      preventDefault: () => event.preventDefault(),
      target: {
        name: option.label?.toString() || "",
        id: "list",
        value: optionValue,
      },
    };
    onChange?.(changeEvent);
  };

  const flatOptions = (options: GroupData[] | undefined) => {
    return (options || []).reduce(
      (result: MixedOptionArray, option: GroupData, index: number) => {
        result.push({
          optionGroup: option,
          group: true,
          index,
          label: option[optionGroupLabel as keyof GroupData],
        });

        const groupChildren = optionGroupChildren
          ? option[optionGroupChildren as keyof GroupData]
          : null;

        if (Array.isArray(groupChildren)) {
          groupChildren.forEach((o: OptionData) => {
            result.push(o);
          });
        }
        return result;
      },
      [] as MixedOptionArray,
    );
  };

  const createItem = (option: OptionData | OptionGroupItem, index: number) => {
    const isOptionGroupItem = (
      item: OptionData | OptionGroupItem,
    ): item is OptionGroupItem => {
      return "group" in item && item.group === true;
    };

    if (isOptionGroupItem(option)) {
      const groupContent =
        option.optionGroup[optionGroupLabel as keyof GroupData];
      const key = `group_${index}_${String(groupContent)}`;

      return (
        <li
          key={key}
          role-slot="list-group"
          aria-label={String(groupContent || "")}
          className={clsx(
            "font-bold text-mc-sd-mut py-mc-li-py px-mc-li-px text-sm",
          )}
          style={listGroupStyle}
        >
          {String(groupContent || " ")}
        </li>
      );
    }

    const optionData = option as OptionData;
    const optionKey = optionData[optionLabel as keyof OptionData];
    const key = `option_${index}_${String(optionKey)}`;
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      handleSelect(e, optionData);
    };

    const optionValue = optionData[optionLabel];
    const isSelected = String(optionValue) === String(value);

    return (
      <li
        key={key}
        role-slot="list-item"
        className={twMerge(
          clsx(
            "py-mc-li-py px-mc-li-px hover:bg-mc-li-hv text-mc-fg cursor-pointer",
            {
              "bg-mc-li-act text-mc-li-act-fg": isSelected,
            },
          ),
        )}
        id={`lo_id_${index}`}
        style={listItemStyle}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSelect(
              e as
                | React.MouseEvent<HTMLElement>
                | React.KeyboardEvent<HTMLElement>,
              optionData,
            );
          }
        }}
      >
        {String(optionKey || "")}
      </li>
    );
  };

  const createList = () => {
    const finalOptions = optionGroupLabel
      ? flatOptions(options as GroupData[] | undefined)
      : (options as OptionData[]);

    return (
      <ul role-slot="listbox" style={listBoxStyle}>
        {finalOptions?.map((option, index) => createItem(option, index))}
      </ul>
    );
  };

  const list = createList();

  return (
    <div
      className={twMerge(clsx("bg-mc-bg", props.className))}
      style={listStyle}
      data-slot="list"
      {...props}
    >
      {list}
    </div>
  );
};
