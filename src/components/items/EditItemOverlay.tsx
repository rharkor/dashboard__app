import { Button } from "primereact/button";
import { Item } from "../../../types/api";
import { useApi } from "@/contexts/ApiContext";
import { confirmDialog } from "primereact/confirmdialog";

const EditItemOverlay = ({
  item,
  selected,
  setSelected,
  editItem,
}: {
  item: Item;
  selected: boolean;
  setSelected: (selected: boolean) => void;
  editItem: (item: Item) => void;
}) => {
  const { deleteItem, fetchItems } = useApi();

  const handleDelete = async () => {
    if (item.children?.length === 0) {
      await deleteItem(item.id.toString());
      setSelected(false);
      fetchItems(item.parent?.id.toString() || undefined);
    } else {
      handleDeleteConfirm();
    }
  };

  const handleDeleteGroup = async () => {
    await deleteItem(item.id.toString(), true);
    setSelected(false);
    fetchItems(item.parent?.id.toString() || undefined);
  };

  const handleEdit = () => {
    editItem(item);
    setSelected(false);
  };

  const handleDeleteConfirm = () => {
    confirmDialog({
      message: "Are you sure you want to delete this item?",
      header: "Delete item",
      icon: "pi pi-exclamation-triangle",
      accept: handleDeleteGroup,
      reject: () => {},
    });
  };

  return (
    <>
      <div
        className="absolute top-0 left-0 w-full z-10"
        style={{
          height: selected ? "100%" : "0%",
          borderRadius: "6px",
        }}
      ></div>
      <div
        className="flex flex-col absolute top-0 left-0 w-full bg-gray-900 bg-opacity-80 z-10 transition-all overflow-hidden"
        style={{
          height: selected ? "100%" : "0%",
          transitionDuration: !selected ? "0.3s" : "0.7s",
          borderRadius: "6px",
        }}
      >
        <div className="flex items-center justify-center flex-1">
          <Button
            label="Edit"
            severity="warning"
            onClick={handleEdit}
            className="p-button-text h-[25px] md:h-[50px]"
          />
        </div>
        <div className="flex items-center justify-center flex-1">
          <Button
            label="Delete"
            className="p-button-text h-[25px] md:h-[50px]"
            severity="danger"
            onClick={handleDelete}
          />
        </div>
        <div className="flex items-center justify-center flex-1">
          <Button
            label="Cancel"
            onClick={() => setSelected(false)}
            className="p-button-text h-[25px] md:h-[50px]"
            severity="info"
          />
        </div>
      </div>
    </>
  );
};

export default EditItemOverlay;
