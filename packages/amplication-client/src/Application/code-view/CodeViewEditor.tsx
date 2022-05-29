import MonacoEditor from "@monaco-editor/react";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { StorageBaseAxios } from "./StorageBaseAxios";

type Props = {
  appId: string;
  buildId: string;
  filePath: string;
  fileName: string;
};

const UNSUPPORTED_EXTENSIONS = ["png", "ico"];
const UNSUPPORTED_EXTENSION_MESSAGE = "Preview is not available";

const CodeViewEditor = ({ appId, buildId, filePath, fileName }: Props) => {
  const [content, setContent] = useState<string>("");

  const path = filePath;

  const fileExtension = useMemo(() => {
    return fileName.split(".").pop();
  }, [fileName]);
  useLayoutEffect(() => {
    (async () => {
      if (!path) {
        return;
      }
      if (
        fileExtension &&
        UNSUPPORTED_EXTENSIONS.includes(fileExtension.toLocaleLowerCase())
      ) {
        setContent(UNSUPPORTED_EXTENSION_MESSAGE);
        return;
      }
      const data = await StorageBaseAxios.instance.fileContent(
        appId,
        buildId,
        path
      );

      setContent(data);
    })();
  }, [appId, buildId, filePath, path, fileExtension]);

  if (!path) {
    return <div />;
  }

  return (
    <MonacoEditor
      beforeMount={setEditorTheme}
      height="100%"
      value={content}
      options={{ readOnly: true }}
      path={path}
      theme={"vs-dark-amp"}
    />
  );
};

export default CodeViewEditor;

function setEditorTheme(monaco: any) {
  monaco.editor.defineTheme("vs-dark-amp", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#15192c",
    },
  });
}
