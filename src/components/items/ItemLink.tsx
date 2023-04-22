import Link from "next/link";
import { ItemWithText } from "../../../types/api";
import { ItemCardWrapper } from "./ItemCard";
import ItemInnerCard from "./ItemInnerCard";

const ItemLink = ({ item }: { item: ItemWithText }) => {
  return (
    <Link
      href={item.text}
      passHref
      target="_blank"
      className="h-full block w-full"
    >
      <ItemCardWrapper>
        <ItemInnerCard item={item} />
        <p className="text-xs text-gray-500 absolute top-2 right-2">link</p>
      </ItemCardWrapper>
    </Link>
  );
};

export default ItemLink;
