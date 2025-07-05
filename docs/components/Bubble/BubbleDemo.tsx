import { Bubble } from "@matechat/react";
import avatar from "./avatar.png";

export default function BubbleDemo() {
  return (
    <div className="bubble-chat">
      <div className="bubble-row left">
        <img src={avatar} alt="Bot" className="avatar" />
        <Bubble text="您好，请问有什么可以帮您？" />
      </div>
      <div className="bubble-row right">
        <Bubble text="我想了解一下产品功能！" />
        <img src={avatar} alt="User" className="avatar" />
      </div>
      <div className="bubble-row left">
        <img src={avatar} alt="Bot" className="avatar" />
        <Bubble text="好的，请稍等..." isPending />
      </div>
    </div>
  );
}
