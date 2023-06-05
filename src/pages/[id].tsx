import Items from "@/components/items/Items";
import { useApi } from "@/contexts/ApiContext";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { Item, ItemParent } from "../../types/api";
import { Button } from "primereact/button";
import AddItemModal from "@/components/items/AddItemModal";
import { useAuth } from "@/contexts/AuthContext";

const BreadCrumb: FC<{
  model?: {
    label: string;
    command: () => void;
    id: string;
  }[];
}> = ({ model }) => {
  return (
    <>
      {model?.map((item, index) => (
        <React.Fragment key={item.label}>
          <span
            className={
              index === model.length - 1
                ? "text-[var(--primary-color-lighten)]"
                : "cursor-pointer hover:text-[var(--primary-color)]  arianne-item"
            }
            onClick={item.command}
            data-id={item.id}
          >
            {item.label}
          </span>
          {index !== model.length - 1 && <span> / </span>}
        </React.Fragment>
      ))}
    </>
  );
};

const HomeId = () => {
  const router = useRouter();
  const { id } = router.query;
  const [parent, setParent] = useState<ItemParent>();
  const { items, itemsLoading, fetchItems, fetchParent } = useApi();
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
    if (id) {
      fetchItems(id.toString());
      fetchParent(id.toString()).then((parent) =>
        setParent(parent || undefined)
      );
    }
  }, [id, fetchItems, fetchParent, isLogged]);

  const breadCrumbItems = [
    {
      label: "Home",
      command: () => router.push("/"),
      id: "",
    },
    ...(parent?.parents.map((parent) => ({
      label: parent.name,
      command: () => router.push(`/${parent.id}`),
      id: parent.id.toString(),
    })) || []),
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4 items-center">
        <Button
          icon="pi pi-arrow-left"
          onClick={
            (breadCrumbItems?.length || 0) > 1
              ? breadCrumbItems?.[breadCrumbItems.length - 2].command
              : () => router.push("/")
          }
          size="small"
        />
        <h1
          className="text-2xl font-bold transition-all"
          style={{
            animation: "fade-in 0.5s ease-in-out",
          }}
        >
          {/* {parent ? parent.name : ""} */}
          <BreadCrumb model={breadCrumbItems} />
        </h1>
      </div>
      <Items
        items={items}
        editItem={setEditingItem}
        parentId={id?.toString()}
      />
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
        parent={parent}
        mode={addItemModalMode}
        item={editingItem}
      />
    </div>
  );
};

export default HomeId;
