import { toast } from "react-hot-toast";
import { ItemWithText } from "../../../types/api";
import { ItemCardWrapper } from "./ItemCard";
import ItemInnerCard from "./ItemInnerCard";

const ItemCopy = ({ item }: { item: ItemWithText }) => {
  const handleClick = () => {
    navigator.clipboard.writeText(item.text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div onClick={handleClick} className="cursor-pointer h-full w-full">
      <ItemCardWrapper>
        <ItemInnerCard item={item} />
        <p className="text-xs text-gray-500 absolute top-2 right-2">copy</p>
      </ItemCardWrapper>
    </div>
  );
};

export default ItemCopy;
