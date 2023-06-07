import { FC, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { useApi } from "@/contexts/ApiContext";
import {
  Item,
  ItemParent,
  ItemWithFile,
  ItemWithText,
  itemList,
  itemListType,
} from "../../../types/api";
import { toast } from "react-hot-toast";
import { Password } from "primereact/password";

const createEmptyFile = (name: string) => {
  const file = new File([], name);
  return file;
};

const types: {
  label: string;
  value: itemListType;
}[] = itemList.map((item) => ({
  label: item[0].toUpperCase() + item.slice(1),
  value: item,
}));

const AddItemModal: FC<{
  handleClose: () => void;
  visible: boolean;
  parent?: ItemParent;
  mode?: "create" | "edit";
  item?: Item;
}> = ({ handleClose, visible, parent, mode = "create", item }) => {
  const { createItem, updateItem, fetchItems, refreshToken } = useApi();

  const [name, setName] = useState(item?.name || "");
  const [nameHaveChanged, setNameHaveChanged] = useState(false);
  const [logo, setLogo] = useState<File | undefined>(
    item?.logo ? createEmptyFile(item.logo[0].originalname) : undefined
  );
  const [logoHaveChanged, setLogoHaveChanged] = useState(false);
  const [type, setType] = useState<itemListType>(types[0].value);
  const [typeHaveChanged, setTypeHaveChanged] = useState(false);
  const [text, setText] = useState((item as ItemWithText)?.text || "");
  const [textHaveChanged, setTextHaveChanged] = useState(false);
  const [file, setFile] = useState<File | undefined>(
    (item as ItemWithFile)?.file
      ? createEmptyFile((item as ItemWithFile).file[0].originalname)
      : undefined
  );
  const [fileHaveChanged, setFileHaveChanged] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setLogo(
        item.logo ? createEmptyFile(item.logo[0].originalname) : undefined
      );
      setType(item.type);
      setText((item as ItemWithText)?.text || "");
      setFile(
        (item as ItemWithFile)?.file
          ? createEmptyFile((item as ItemWithFile).file[0].originalname)
          : undefined
      );
    }
  }, [item]);

  const handleCreate = async (e: any) => {
    if ((type === "file" || type === "view") && (!file || file.size === 0)) {
      toast.error("Please select a file");
      return;
    }

    await createItem({
      name,
      logo,
      type,
      text,
      file,
      parent,
    });
    handleCloseCleanForm();
    fetchItems(parent?.id.toString() || "");
  };

  const handleUpdate = async (e: any) => {
    if (
      fileHaveChanged &&
      (type === "file" || type === "view") &&
      (!file || file.size === 0)
    ) {
      toast.error("Please select a file");
      return;
    }
    if (!item) return;

    // If no changes, don't update
    if (
      !nameHaveChanged &&
      !logoHaveChanged &&
      !typeHaveChanged &&
      !textHaveChanged &&
      !fileHaveChanged
    ) {
      handleCloseCleanForm();
      return;
    }

    await updateItem(item.id.toString(), {
      name: nameHaveChanged ? name : undefined,
      logo: logoHaveChanged ? logo : undefined,
      type: typeHaveChanged ? type : undefined,
      text: textHaveChanged ? text : undefined,
      file: fileHaveChanged ? file : undefined,
      parent: parent?.id || undefined,
    });
    handleCloseCleanForm();
    fetchItems(parent?.id.toString() || "");
  };

  const handleCloseCleanForm = () => {
    handleClose();
    // Reset form
    setName("");
    setLogo(undefined);
    setType(types[0].value);
    setText("");
    setFile(undefined);
    (document.getElementById("create-item-form") as HTMLFormElement)?.reset();
  };

  const handleCopy = () => {
    if (!item?.token) return;
    navigator.clipboard
      .writeText(`${window.location.origin}/${item.id}?token=${item.token}`)
      .then(
        () => {
          toast.success("Copied to clipboard!");
        },
        (err) => {
          toast.error("Failed to copy the link!");
        }
      );
  };

  const handleRefreshLink = () => {
    if (!item?.id) return;
    refreshToken(item.id.toString());
    //? Refresh item
    fetchItems(parent?.id.toString() || "");
  };

  const footer = (
    <div className="flex justify-end flex-row gap-2">
      <Button
        icon="pi pi-times"
        label="Cancel"
        className="p-button-text"
        onClick={handleCloseCleanForm}
      />
      <Button
        icon="pi pi-check"
        label={mode === "create" ? "Create" : "Update"}
        type="submit"
        form="create-item-form"
      />
    </div>
  );

  const getTransitionStyle = () => {
    if (type === "group") {
      return {
        maxHeight: "0px",
        height: "0px",
      };
    } else if (type === "copy") {
      return {
        maxHeight: "200px",
        height: "200px",
      };
    } else if (type === "file" || type === "view") {
      return {
        maxHeight: "136px",
        height: "136px",
      };
    } else {
      return {
        maxHeight: "50px",
        height: "50px",
      };
    }
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (mode === "create") {
      handleCreate(e);
    } else if (mode === "edit") {
      handleUpdate(e);
    }
  };

  const handlePaste = async () => {
    const clipboard = window.navigator.clipboard;
    const text = await clipboard.readText();
    const file = new File([text], "clipboard.txt");
    setFile(file);
    setFileHaveChanged(true);
  };

  const handleShow = () => {
    setNameHaveChanged(false);
    setLogoHaveChanged(false);
    setTypeHaveChanged(false);
    setTextHaveChanged(false);
    setFileHaveChanged(false);

    if (item) {
      setName(item.name);
      setLogo(
        item.logo ? createEmptyFile(item.logo[0].originalname) : undefined
      );
      setType(item.type);
      setText((item as ItemWithText)?.text || "");
      setFile(
        (item as ItemWithFile)?.file
          ? createEmptyFile((item as ItemWithFile).file[0].originalname)
          : undefined
      );
    }
  };

  const invoiceUploadHandler = (e: FileUploadHandlerEvent) => {
    const {
      files,
      options: { clear },
    } = e;
    const [file] = files;
    onUpload({
      files: [file],
    });
    clear();
  };

  const onUpload = (e: any) => {
    setLogo(e.files[0]);
    setLogoHaveChanged(true);
  };

  return (
    <Dialog
      header={mode === "create" ? "Create new item" : "Edit item"}
      visible={visible}
      onHide={handleCloseCleanForm}
      onShow={handleShow}
      footer={footer}
      style={{
        minWidth: "50vw",
        width: "500px",
        maxWidth: "calc(100vw - 10px)",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <form
        className="flex flex-col gap-4"
        id="create-item-form"
        onSubmit={handleFormSubmit}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameHaveChanged(true);
            }}
            autoFocus
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="logo">Logo</label>
          <FileUpload
            mode="basic"
            customUpload
            uploadHandler={invoiceUploadHandler}
            auto
            maxFileSize={1024 * 1024 * 1024}
            chooseLabel="Choose file"
            uploadLabel="Upload"
            cancelLabel="Cancel"
            invalidFileSizeMessageSummary="File is too large"
            invalidFileSizeMessageDetail="Maximum size is 10MB"
            onUpload={onUpload}
            onValidationFail={() => {
              toast.error("File is too large!");
            }}
            id="logo-file"
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">
              {logo ? logo.name : "No file chosen"}
            </p>
          </div>
        </div>
        {mode === "edit" && (
          <div className="flex flex-col gap-2">
            <label htmlFor="public-link">Public access link</label>
            <span className="relative">
              <InputText
                id="public-link"
                value={
                  item?.token
                    ? `${window.location.origin}/${item.id}?token=${item.token}`
                    : ""
                }
                readOnly
                disabled
                className="w-full"
              />
              <div className="flex flex-row gap-2 absolute right-2 top-1/2 -translate-y-1/2">
                {item?.token && (
                  <Button className="!p-2" onClick={handleCopy} type="button">
                    <i className="pi pi-copy"></i>
                  </Button>
                )}
                <Button className="!p-2" onClick={handleRefreshLink}>
                  <i className="pi pi-refresh"></i>
                </Button>
              </div>
            </span>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="type">Type</label>
          <Dropdown
            id="type"
            value={type}
            options={types}
            onChange={(e) => {
              setType(e.value);
              setTypeHaveChanged(true);
            }}
            required
          />
        </div>
        <div
          className={`flex flex-row gap-2 transition-all`}
          style={getTransitionStyle()}
        >
          {type === "copy" && (
            <InputTextarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setTextHaveChanged(true);
              }}
              rows={8}
              cols={30}
              style={{
                width: "100%",
                resize: "none",
              }}
              required
            />
          )}
          {type === "password" && (
            <Password
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setTextHaveChanged(true);
              }}
              style={{
                width: "100%",
              }}
              className="child-w-full"
              required
            />
          )}
          {type === "link" && (
            <InputText
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setTextHaveChanged(true);
              }}
              style={{
                width: "100%",
              }}
              required
            />
          )}
          {(type === "file" || type === "view") && (
            <div className="flex flex-col gap-2">
              <FileUpload
                mode="basic"
                customUpload
                uploadHandler={invoiceUploadHandler}
                auto
                maxFileSize={1024 * 1024 * 1024}
                chooseLabel="Choose file"
                uploadLabel="Upload"
                cancelLabel="Cancel"
                invalidFileSizeMessageSummary="File is too large"
                invalidFileSizeMessageDetail="Maximum size is 10MB"
                onUpload={onUpload}
                onValidationFail={() => {
                  toast.error("File is too large!");
                }}
                id="file"
              />
              <Button label="Paste" onClick={handlePaste} type="button" />
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  {file ? file.name : "No file chosen"}
                </p>
              </div>
            </div>
          )}
        </div>
      </form>
    </Dialog>
  );
};

export default AddItemModal;
