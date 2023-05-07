import React, { FC, PropsWithChildren, useState } from "react";
import { useLongPress } from "use-long-press";
import { Item } from "../../../types/api";
import ItemLink from "./ItemLink";
import ItemCopy from "./ItemCopy";
import ItemView from "./ItemView";
import { FileWithContent } from "./Items";
import ItemFile from "./ItemFile";
import ItemGroup from "./ItemGroup";
import EditItemOverlay from "./EditItemOverlay";
import ItemPassword from "./ItemPassword";

interface ItemCardProps {
  item: Item;
  setFile: (file: FileWithContent | null) => void;
  editItem: (item: Item) => void;
}

export const ItemCardWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 p-card hover:shadow-lg transition-all duration-300 hover:scale-105 h-full relative">
      {children}
    </div>
  );
};

const ItemCard: FC<ItemCardProps> = ({ item, setFile, editItem }) => {
  const { type } = item;

  const [selected, setSelected] = useState(false);

  const bind = useLongPress(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      setSelected(true);
    },
    {
      cancelOutsideElement: true,
    }
  );

  return (
    <div
      className="w-[150px] h-[100px] relative shrink-0 md:w-[300px] md:h-[200px]"
      {...bind()}
      style={{
        animationName: selected ? "shake" : "none",
        animationDuration: "0.5s",
        animationTimingFunction: "ease-in-out",
      }}
    >
      {type === "link" && <ItemLink item={item} />}
      {type === "copy" && <ItemCopy item={item} />}
      {type === "password" && <ItemPassword item={item} />}
      {type === "view" && <ItemView item={item} setFile={setFile} />}
      {type === "file" && <ItemFile item={item} />}
      {type === "group" && <ItemGroup item={item} />}
      <EditItemOverlay
        item={item}
        selected={selected}
        setSelected={setSelected}
        editItem={editItem}
      />
    </div>
  );
};

export default ItemCard;
