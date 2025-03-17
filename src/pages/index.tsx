import { Tabs } from "antd";
import Ckeditor from "./ckeditor";
import Lexical from "./lexical";
import Tinymce from "./tinymce";
const Editor = () => {
  return (
    <div>
      <Tabs
        defaultActiveKey="2"
        items={[
          {
            label: `ckeditor`,
            key: "ckeditor",
            children: <Ckeditor />,
          },
          {
            label: "lexical",
            key: "lexical",
            children: <Lexical />,
          },
          {
            label: "tinymce",
            key: "tinymce",
            children: <Tinymce />,
          },
        ]}
      />
    </div>
  );
};
export default Editor;
