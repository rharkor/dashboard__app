import AddItemModal from "@/components/items/AddItemModal";
import Items from "@/components/items/Items";
import { useApi } from "@/contexts/ApiContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { Item } from "../../types/api";

export default function Home() {
  const { items, itemsLoading, fetchItems } = useApi();
  const { isLogged } = useAuth();

  const [addItemModal, setAddItemModal] = useState(false);
  const [addItemModalMode, setAddItemModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [editingItem, _setEditingItem] = useState<Item>();

  const openAddItemModal = () => {
    setAddItemModalMode("create");
    _setEditingItem(undefined);
    setAddItemModal(true);
  };

  const setEditingItem = (item: Item) => {
    setAddItemModalMode("edit");
    _setEditingItem(item);
    setAddItemModal(true);
  };

  const closeAddItemModal = () => {
    setAddItemModal(false);
  };

  useEffect(() => {
    if (!isLogged) return;
    fetchItems();
  }, [fetchItems, isLogged]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <h1
          className="text-2xl font-bold transition-all"
          style={{
            animation: "fade-in 0.5s ease-in-out",
          }}
        >
          Home
        </h1>
      </div>
      <Items items={items} editItem={setEditingItem} />
      <Button
        icon="pi pi-plus"
        label="Add item"
        className="!fixed bottom-4 right-4"
        rounded
        onClick={openAddItemModal}
      />
      <AddItemModal
        handleClose={closeAddItemModal}
        visible={addItemModal}
        mode={addItemModalMode}
        item={editingItem}
      />
    </div>
  );
}
