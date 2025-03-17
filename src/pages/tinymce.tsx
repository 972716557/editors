import React, { useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import ReactDOM from "react-dom";
import { uniqueId } from "lodash";

const prefix = "e-space-editor-video";
// 在项目中获取资源清单并传递给 TinyMCE

export default function App() {
  const editorRef = useRef(null);
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
          wrapper.parentNode.replaceChild(video, wrapper);
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

  useEffect(() => {
    if (editorRef.current) {
      const customBoldButton = editorRef.current
        .getContainer()
        .querySelector(
          '.tox-tbtn--select[data-mce-name="custvideo"] .tox-tbtn__select-label'
        );
      if (customBoldButton) {
        const antdButton = <VideoUpload editor={editorRef.current} />;
        ReactDOM.render(antdButton, customBoldButton);
      }
    }
  }, [editorRef?.current]);

  const videoId = useMemo(() => {
    return `${prefix}-${uniqueId()}`;
  }, []);
  return (
    <>
      {/* <video id={videoId}></video> */}
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
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
          plugins: [
            "advlist autolink lists charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help strikethrough",
            "link",
            "wordcount",
            "styleselect",
            "formatselect",
            "imagetools",
            "fontsize fontsizeselect",
            "custvideo",
          ],
          //   setup: (editor) => {
          //     editor.on("click", (e) => {
          //       if (e.target.classList.contains("icon-delete2")) {
          //         const videoWrapper = e.target.closest(
          //           ".e-space-editor-video__content"
          //         );
          //         if (videoWrapper) {
          //           editor.dom.remove(videoWrapper);
          //         }
          //       }
          //     });
          //     editor.on("SetContent", () => {
          //       const contentDocument = editor.getDoc();
          //       const images = contentDocument.querySelectorAll(
          //         `.${ESpaceEditorInitialVideo}`
          //       );
          //       images.forEach((img) => {
          //         const src = img.getAttribute("data-mce-src");
          //         const antdImageWrapper = document.createElement("div");
          //         const antdImage = (
          //           <Video
          //             fileId={src}
          //             videoId={videoId}
          //             editor={editorRef.current}
          //           />
          //         );
          //         ReactDOM.render(antdImage, antdImageWrapper);
          //         img.parentNode.replaceChild(antdImageWrapper, img);
          //       });
          //     });
          //     editor.ui.registry.addButton("custimage", {
          //       text: "image",
          //       onAction: () => {
          //         handleCustomButtonClick();
          //       },
          //     });
          //     editor.ui.registry.addButton("custvideo", {
          //       text: "video",
          //       onAction: () => {},
          //     });
          //   },
          promotion: false,
          branding: false,
          toolbar:
            "undo redo | styleselect formatselect | bold italic strikethrough | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | \
         custimage custvideo link  | fontsize | h1 h2 h3 h4 h5 h6",
          fontsize_formats: "8px 10px 12px 14px 18px 24px 38px",
        }}
      />

      <button onClick={log}>Log editor content</button>
    </>
  );
}
