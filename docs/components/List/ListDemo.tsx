import { List } from "@matechat/react";
import React, { useState } from "react";

export default function ListDemoFlat() {
  const [selected, setSelected] = useState<string | undefined>();

  const options = [
    { label: "选项 1", value: "1" },
    { label: "选项 2", value: "2" },
    { label: "选项 3", value: "3" },
  ];

  return (
    <div
      style={{
        width: 400,
        margin: "0 auto",
        background: "#fafafa",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ marginBottom: 12, fontWeight: 500, fontSize: 14 }}>
        当前选中:{" "}
        <span style={{ color: selected ? "#2563eb" : "#999" }}>
          {selected || "无"}
        </span>
      </div>
      <List value={selected} options={options} onSelected={setSelected} />
    </div>
  );
}
