import { FC } from "react";
import { Item } from "../../../types/api";
import Image from "next/image";

const ItemInnerCard: FC<{
  item: Item;
}> = ({ item }) => {
  if (item.logo) {
    return (
      <div className="flex flex-col gap-2 h-full justify-center items-center">
        <div className="flex flex-row gap-2 items-center relative h-full w-full">
          <Image
            src={"/api/" + item.logo[0].path + "/" + "logo"}
            alt={item.name}
            fill
            className="object-contain"
          />
        </div>
        <h4 className="text-base md:text-lg font-semibold">{item.name}</h4>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 h-full justify-center items-center">
      <h4 className="text-xl md:text-2xl font-semibold">{item.name}</h4>
    </div>
  );
};

export default ItemInnerCard;
