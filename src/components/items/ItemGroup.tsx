import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ItemGroup } from "../../../types/api";
import { ItemCardWrapper } from "./ItemCard";
import ItemInnerCard from "./ItemInnerCard";

const ItemGroup = ({ item }: { item: ItemGroup }) => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const url = token
    ? `${item.id.toString()}?token=${token}`
    : `${item.id.toString()}`;

  return (
    <Link href={url} passHref>
      <ItemCardWrapper>
        <ItemInnerCard item={item} />
      </ItemCardWrapper>
    </Link>
  );
};

export default ItemGroup;
