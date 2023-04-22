import { FC, useState } from "react";
import { File, Item } from "../../../types/api";
import ItemCard from "./ItemCard";
import FileViewDialog from "./FileViewDialog";

export type FileWithContent = File & { content: string };

const Items: FC<{
  items: Item[];
  editItem: (item: Item) => void;
}> = ({ items, editItem }) => {
  const [file, setFile] = useState<FileWithContent | null>(null);

  return (
    <div className="flex flex-row gap-4 wrap justify-center items-center">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          setFile={setFile}
          editItem={editItem}
        />
      ))}
      <FileViewDialog file={file} setFile={setFile} />
    </div>
  );
};

export default Items;
