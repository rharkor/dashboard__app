import Link from "next/link";
import { ItemGroup } from "../../../types/api";
import { ItemCardWrapper } from "./ItemCard";
import ItemInnerCard from "./ItemInnerCard";

const ItemGroup = ({ item }: { item: ItemGroup }) => {
  return (
    <Link href={item.id.toString()} passHref>
      <ItemCardWrapper>
        <ItemInnerCard item={item} />
      </ItemCardWrapper>
    </Link>
  );
};

export default ItemGroup;
