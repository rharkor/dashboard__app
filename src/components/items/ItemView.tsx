import { useApi } from "@/contexts/ApiContext";
import { ItemWithFile } from "../../../types/api";
import { ItemCardWrapper } from "./ItemCard";
import ItemInnerCard from "./ItemInnerCard";
import { FileWithContent } from "./Items";

const ItemView = ({
  item,
  setFile,
}: {
  item: ItemWithFile;
  setFile: (file: FileWithContent | null) => void;
}) => {
  const { loadFile } = useApi();

  const handleClick = async () => {
    const fileContent = await loadFile(item.file[0]);
    setFile({
      ...item.file[0],
      content: fileContent,
    });
  };

  return (
    <div onClick={handleClick} className="cursor-pointer h-full w-full">
      <ItemCardWrapper>
        <ItemInnerCard item={item} />
        <p className="text-xs text-gray-500 absolute top-2 right-2">view</p>
      </ItemCardWrapper>
    </div>
  );
};

export default ItemView;