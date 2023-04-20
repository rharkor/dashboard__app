import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Messages } from "primereact/messages";
import { FC, useEffect, useRef, useState } from "react";
import api from "@/utils/api";
import Link from "next/link";
import { toast } from "react-hot-toast";

type Api = {
  id: number;
  name: string;
  description: string;
};

const ApiManager: FC = () => {
  const [createApiModal, setCreateApiModal] = useState(false);
  const [createApiName, setCreateApiName] = useState("");
  const [createApiDescription, setCreateApiDescription] = useState("");
  const [deleteApiDialog, setDeleteApiDialog] = useState(false);
  const [apis, setApis] = useState<Api[]>([]);
  const [selectedApi, setSelectedApi] = useState<Api | null>(null);

  const msgs = useRef<Messages>(null);

  const hanldeCreateApi = async (e: any) => {
    e.preventDefault();
    const createApiPromise = api.fetch("apis", {
      method: "POST",
      body: JSON.stringify({
        name: createApiName,
        description: createApiDescription,
      }),
    });
    const res = await toast.promise(createApiPromise, {
      loading: "Creating Api",
      success: "Api created",
      error: "Failed to create Api",
    });
    setCreateApiName("");
    setCreateApiDescription("");
    setCreateApiModal(false);
    setApis((prev) => [...prev, res]);
    navigator.clipboard.writeText(res.token);

    if (msgs.current)
      // Display api key copy button
      msgs.current.show({
        severity: "success",
        summary: "Success",
        closable: true,
        content: (
          <div className="flex flex-row gap-4 items-center">
            <p>
              Your api is successfully created. The access token has been copied
              to your clipboard.
            </p>
            <Button
              label="Copy"
              icon="pi pi-copy"
              severity="info"
              onClick={() => {
                navigator.clipboard.writeText(res.token);
                toast.success("Copied to clipboard");
              }}
              size="small"
            />
          </div>
        ),
        life: 10 * 1000 * 60,
      });
  };

  useEffect(() => {
    api.fetch("apis").then((res) => setApis(res));
  }, []);

  const confirmDeleteApi = (api: Api) => {
    setSelectedApi(api);
    setDeleteApiDialog(true);
  };

  const deleteApi = () => {
    const deleteApiPromise = api.fetch(`apis/${selectedApi?.id}`, {
      method: "DELETE",
    });
    toast.promise(deleteApiPromise, {
      loading: "Deleting Api",
      success: "Api deleted",
      error: "Failed to delete Api",
    });
    setDeleteApiDialog(false);
    setApis((prev) => prev.filter((api) => api.id !== selectedApi?.id));
  };

  const actionBodyTemplate = (rowData: Api) => {
    return (
      <>
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteApi(rowData)}
        />
      </>
    );
  };

  const hideDeleteApiDialog = () => {
    setDeleteApiDialog(false);
  };

  const deleteApiDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteApiDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteApi}
      />
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-row self-end">
        <Link href="/">
          <Button className="flex gap-2 w-fit">
            Check events <i className="pi pi-server"></i>
          </Button>
        </Link>
        <Button
          className="flex gap-2 w-fit"
          severity="success"
          onClick={() => setCreateApiModal(true)}
        >
          Create Api <i className="pi pi-plus"></i>
        </Button>
      </div>
      <Messages ref={msgs} />
      <DataTable value={apis} tableStyle={{ minWidth: "50rem" }}>
        <Column
          field="name"
          header="Name"
          style={{
            minWidth: "20rem",
          }}
        ></Column>
        <Column
          field="description"
          header="Description"
          style={{
            width: "100%",
          }}
        ></Column>
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "12rem" }}
        ></Column>
      </DataTable>
      <Dialog
        header="Create Api"
        visible={createApiModal}
        onHide={() => setCreateApiModal(false)}
        className="w-[50rem]"
      >
        <form className="flex flex-col gap-4" onSubmit={hanldeCreateApi}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={createApiName}
              onChange={(e) => setCreateApiName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="description">Description</label>
            <InputText
              id="description"
              value={createApiDescription}
              onChange={(e) => setCreateApiDescription(e.target.value)}
              required
            />
          </div>
          <Button label="Create" type="submit" className="self-end"></Button>
        </form>
      </Dialog>
      <Dialog
        visible={deleteApiDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteApiDialogFooter}
        onHide={hideDeleteApiDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedApi && (
            <span>
              Are you sure you want to delete <b>{selectedApi.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default ApiManager;
