import { toast } from "react-hot-toast";
import { ItemWithText } from "../../../types/api";
import { ItemCardWrapper } from "./ItemCard";
import ItemInnerCard from "./ItemInnerCard";
import { useApi } from "@/contexts/ApiContext";

const ItemPassword = ({ item }: { item: ItemWithText }) => {
  const { fetchItem } = useApi();

  const handleClick = async () => {
    const decodePromise = new Promise<void>(async (resolve, reject) => {
      const res = await fetchItem(item.id.toString());
      if (!res) reject({ error: "Failed to fetch item" });
      navigator.clipboard.writeText((res as ItemWithText).text);
      resolve();
    });
    await toast.promise(decodePromise, {
      loading: "Decoding...",
      success: "Copied to clipboard",
      error: (err) => err.error || "Failed to decode",
    });
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

export default ItemPassword;
