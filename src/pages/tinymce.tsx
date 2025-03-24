import React, { useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import ReactDOM from "react-dom";
// import "./index.less";

const prefix = "e-space-editor-video";
// 在项目中获取资源清单并传递给 TinyMCE

export default function App() {
  const editorRef = useRef<TinyMCEEditor>();
  const log = () => {
    if (editorRef.current) {
      let content = editorRef.current.getContent();
      // 转换自定义 Video 组件为普通 video 标签
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const customVideoWrappers = doc.querySelectorAll(
        ".e-space-editor-video__content"
      );
      customVideoWrappers.forEach((wrapper) => {
        const video = wrapper.querySelector("video");
        if (video) {
          wrapper.parentNode?.replaceChild(video, wrapper);
        }
      });
      content = doc.body.innerHTML;
      console.log(content);
    }
  };
  const [open, setOpen] = useState(false);
  const handleCustomButtonClick = () => {
    // Open your image upload dialog here
    // ...
    setOpen(true);
  };

  // useEffect(() => {
  //   if (editorRef.current) {
  //     const customBoldButton = editorRef.current
  //       ?.getContainer()
  //       .querySelector(
  //         '.tox-tbtn--select[data-mce-name="custvideo"] .tox-tbtn__select-label'
  //       );
  //     if (customBoldButton) {
  //       const antdButton = <VideoUpload editor={editorRef.current} />;
  //       ReactDOM.render(antdButton, customBoldButton);
  //     }
  //   }
  // }, [editorRef?.current]);

  // const videoId = useMemo(() => {
  //   return `${prefix}-${uniqueId()}`;
  // }, []);
  return (
    <div style={{ position: "relative" }}>
      {/* <video
        style={{ position: "absolute", left: 0, top: 0, visibility: "hidden" }}
        id={videoId}
      ></video> */}
      <Editor
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        apiKey="8i4ht3vqi8kt619mtxxsexmikfmtow62hy04g4zags4mh738"
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 1000,
          language: "zh_CN",
          menubar: false,
          content_css: [
            "https://web.sdk.qcloud.com/player/tcplayer/release/v5.2.0/tcplayer.min.css",
            "tinymce/index.css",
          ],
          toolbar:
            "undo redo | headingMenu fontSizeMenu styleselect formatselect | bold italic strikethrough underline | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | removeformat | \
       custimage custvideo link  ",
          plugins: [
            "advlist autolink lists charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help strikethrough underline",
            "link",
            "wordcount",
            "styleselect",
            "formatselect",
            "imagetools",
            "fontsize fontSizeMenu",
            "custvideo",
          ],
          setup: (editor) => {
            let formatMenuButton: any;
            let fontSizeMenuButton: any; // 保存下拉框按钮的引用

            // 定义字号列表
            const fontSizeOptions = [
              { text: "15px", value: "15px" },
              { text: "16px", value: "16px" },
              { text: "18px", value: "18px" },
              { text: "20px", value: "20px" },
              { text: "24px", value: "24px" },
              { text: "30px", value: "30px" },
            ];

            // 注册自定义下拉菜单
            editor.ui.registry.addMenuButton("fontSizeMenu", {
              text: "15px", // 默认显示文本
              fetch: (callback) => {
                // 生成菜单项
                const items = fontSizeOptions.map((option) => ({
                  type: "menuitem",
                  text: option.text,
                  onAction: () => {
                    // 应用字体大小
                    if (option.value === "") {
                      editor.execCommand("removeFormat"); // 清除字号格式
                    } else {
                      editor.execCommand("fontSize", false, option.value);
                    }
                    fontSizeMenuButton.setText(option.text); // 更新下拉框显示文本
                  },
                }));
                callback(items);
              },
              onSetup: (api) => {
                fontSizeMenuButton = api; // 保存按钮引用
                return () => {};
              },
            });

            editor.ui.registry.addMenuButton("headingMenu", {
              text: "标题",
              fetch: (callback) => {
                callback([
                  {
                    type: "menuitem",
                    text: "标题一",
                    onAction: () => {
                      editor.execCommand("FormatBlock", false, "h1");
                      formatMenuButton.setText("标题一");
                    },
                  },
                  {
                    type: "menuitem",
                    text: "标题二",
                    onAction: () => {
                      editor.execCommand("FormatBlock", false, "h2");
                      formatMenuButton.setText("标题二");
                    },
                  },
                  {
                    type: "menuitem",
                    text: "正文",
                    onAction: () => {
                      editor.execCommand("FormatBlock", false, "p");
                      formatMenuButton.setText("正文");
                    },
                  },
                ]);
              },
              onSetup: (api) => {
                formatMenuButton = api; // 保存按钮引用
                return () => {}; // 清理函数
              },
            });

            // 监听光标位置变化
            editor.on("NodeChange", (e) => {
              // 监听光标位置变化，动态更新下拉框显示文本
              const currentFontSize =
                editor.dom.getStyle(e.element, "font-size") || "";
              const matchedOption = fontSizeOptions.find(
                (opt) => opt.value === currentFontSize
              );
              fontSizeMenuButton?.setText(
                matchedOption ? matchedOption.text : "15px"
              );

              const blockTag = editor.dom.getParent(e.element, "h1,h2,p"); // 获取当前块级标签
              if (blockTag) {
                const tagName = blockTag.tagName.toLowerCase(); // 获取标签名（如 h1、h2、p）
                let displayText = "正文"; // 默认显示文本
                if (tagName === "h1") displayText = "标题一";
                else if (tagName === "h2") displayText = "标题二";
                formatMenuButton?.setText(displayText); // 更新下拉框文本
              }
            });
            editor.on("click", (e) => {
              if (e.target.classList.contains("icon-delete2")) {
                const videoWrapper = e.target.closest(
                  ".e-space-editor-video__content"
                );
                if (videoWrapper) {
                  editor.dom.remove(videoWrapper);
                }
              }
            });
            // editor.on("SetContent", () => {
            //   const contentDocument = editor.getDoc();
            //   const images = contentDocument.querySelectorAll(
            //     `.${ESpaceEditorInitialVideo}`
            //   );
            //   images.forEach((img) => {
            //     const src = img.getAttribute("data-mce-src");
            //     const antdImageWrapper = document.createElement("div");
            //     const antdImage = (
            //       <Video
            //         fileId={src}
            //         videoId={videoId}
            //         editor={editorRef.current}
            //       />
            //     );
            //     ReactDOM.render(antdImage, antdImageWrapper);
            //     img.parentNode?.replaceChild(antdImageWrapper, img);
            //   });
            // });
            editor.ui.registry.addButton("custimage", {
              text: "image",
              onAction: () => {
                handleCustomButtonClick();
              },
            });
            editor.ui.registry.addButton("custvideo", {
              text: "video",
              onAction: () => {},
            });
          },
          promotion: false,
          branding: false,
        }}
      />
      {/* <ImageModal
        open={open}
        editor={editorRef.current}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          setOpen(false);
        }}
      /> */}
    </div>
  );
}
