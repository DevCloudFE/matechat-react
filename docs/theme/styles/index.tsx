import { useLang } from "rspress/runtime";
import { 
  HomeLayout as BasicHomeLayout, 
  Layout as BasicLayout 
} from "rspress/theme";
import "./styles/index.css";

function HomeLayout() {
  //   const { code: Code } = getCustomMDXComponent();
  return <BasicHomeLayout />;
}

const Layout = () => {
  const lang = useLang();
  return (
    <BasicLayout
      beforeNav={
        <div className="text-center from-sky-400 to-emerald-600 bg-gradient-to-r text-white font-bold py-1">
          {lang === "en"
            ? "🚧 MateChat React document is still under development"
            : "🚧 MateChat React 文档仍在开发中"}
        </div>
      }
      // components={{ ... }}
    />
  );
};

export default { HomeLayout, Layout };
export * from "rspress/theme";