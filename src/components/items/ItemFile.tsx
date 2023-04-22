import { useApi } from "@/contexts/ApiContext";
import { ItemCardWrapper } from "./ItemCard";
import ItemInnerCard from "./ItemInnerCard";
import { ItemWithFile } from "../../../types/api";

const ItemFile = ({ item }: { item: ItemWithFile }) => {
  const { loadFile } = useApi();

  const handleClick = async () => {
    const fileContent = await loadFile(item.file[0]);
    if (!fileContent) return;
    const element = document.createElement("a");
    const newFile = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(newFile);
    element.download = item.file[0].filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div onClick={handleClick} className="cursor-pointer h-full w-full">
      <ItemCardWrapper>
        <ItemInnerCard item={item} />
        <p className="text-xs text-gray-500 absolute top-2 right-2">file</p>
      </ItemCardWrapper>
    </div>
  );
};

export default ItemFile;
