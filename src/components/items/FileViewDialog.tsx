import { FC } from "react";
import { Dialog } from "primereact/dialog";
import { Editor } from "@monaco-editor/react";
import { Button } from "primereact/button";
import { toast } from "react-hot-toast";
import { FileWithContent } from "./Items";

const FileViewDialog: FC<{
  file: FileWithContent | null;
  setFile: (file: FileWithContent | null) => void;
}> = ({ file, setFile }) => {
  const handleClose = () => {
    setFile(null);
  };

  const handleCopy = () => {
    if (!file) return;
    navigator.clipboard.writeText(file.content).then(
      () => {
        toast.success("Copied to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy to clipboard!");
      }
    );
  };

  const handleDownload = () => {
    if (!file) return;
    const element = document.createElement("a");
    const newFile = new Blob([file.content], { type: "text/plain" });
    element.href = URL.createObjectURL(newFile);
    element.download = file.originalname;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const footer = (
    <div className="flex justify-end flex-row gap-2">
      <Button
        icon="pi pi-download"
        label="Download"
        onClick={handleDownload}
        severity="success"
      />
      <Button
        icon="pi pi-clone"
        label="Copy"
        onClick={handleCopy}
        severity="info"
      />
      <Button
        icon="pi pi-times"
        label="Close"
        onClick={handleClose}
        severity="danger"
      />
    </div>
  );

  return (
    <Dialog
      header="File content"
      visible={!!file?.content}
      onHide={handleClose}
      style={{
        minWidth: "50vw",
        width: "500px",
        maxWidth: "calc(100vw - 10px)",
        marginLeft: "auto",
        marginRight: "auto",
        minHeight: "50vh",
      }}
      maximizable
      footer={footer}
    >
      <div className="h-full w-full relative min-h-[50vh]">
        <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-4">
          <Editor
            defaultValue={""}
            value={file?.content}
            language=""
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: {
                enabled: false,
              },
            }}
            width="100%"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default FileViewDialog;
