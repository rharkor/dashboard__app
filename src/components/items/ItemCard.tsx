import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
    <div className="flex flex-col gap-4 p-2 md:p-8 p-card hover:shadow-lg transition-all duration-300 hover:scale-105 h-full relative">
      {children}
    </div>
  );
};

const preventDefault = (e: any) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
};

const ItemCard: FC<ItemCardProps> = ({ item, setFile, editItem }) => {
  const { type } = item;

  const [selected, setSelected] = useState(false);

  const mainDiv = useRef<HTMLDivElement>(null);
  const parentDiv = useRef<HTMLDivElement>(null);
  const [moveSelected, setMoveSelected] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [parentStyle, setParentStyle] = useState<React.CSSProperties>({});
  const [initialOffset, setInitialOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const bind = useLongPress(
    (e) => {
      preventDefault(e);
      setSelected(true);
    },
    {
      cancelOutsideElement: true,
    }
  );

  const restartPosition = () => {
    setMoveSelected(false);
    const originalPosition = parentDiv.current?.getBoundingClientRect();
    const currentSize = mainDiv.current?.getBoundingClientRect();
    if (!originalPosition || !currentSize) return;
    setParentStyle({
      zIndex: 1000,
    });
    setTimeout(() => {
      setStyle({
        position: "fixed",
        top: `${
          originalPosition.y +
          window.scrollY +
          (originalPosition.height - currentSize.height) / 2
        }px`,
        left: `${
          originalPosition.x +
          window.scrollX +
          (originalPosition.width - currentSize.width) / 2
        }px`,
        zIndex: 1000,
        transition: "all 0.5s ease-in-out",
      });
    }, 100);
    setTimeout(() => {
      setStyle({});
      setParentStyle({});
    }, 600);
  };

  const handleMouseUp: EventListenerOrEventListenerObject = (e) => {
    preventDefault(e);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("pointerup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("pointermove", handleMouseMove);
  };

  const handleMouseMove = (e: MouseEvent) => {
    preventDefault(e);

    const { clientX, clientY } = e;

    const x = clientX - (initialOffset?.x ?? 0);
    const y = clientY - (initialOffset?.y ?? 0);

    setStyle({
      position: "fixed",
      top: `${y}px`,
      left: `${x}px`,
      zIndex: 1000,
    });
    setParentStyle({
      maxWidth: "0",
      zIndex: 1000,
    });
  };

  const handleMouseDown: EventListenerOrEventListenerObject = (e) => {
    preventDefault(e);
    let active = true;
    const release = () => {
      active = false;
    };
    document.addEventListener("mouseup", release);
    document.addEventListener("pointerup", release);
    setTimeout(() => {
      document.removeEventListener("mouseup", release);
      document.removeEventListener("pointerup", release);
      if (!active) return;
      const mainDivClientRect = mainDiv.current?.getBoundingClientRect();
      if (!mainDivClientRect) return;
      const { clientX, clientY } = e as any;
      const offsetX = clientX - mainDivClientRect.x + window.scrollX;
      const offsetY = clientY - mainDivClientRect.y + window.scrollY;
      const newInitialOffset = { x: offsetX, y: offsetY };
      setInitialOffset(newInitialOffset);
      setMoveSelected(true);
    }, 100);
  };

  useEffect(() => {
    if (!initialOffset) return;

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("pointerup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointermove", handleMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("pointerup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointermove", handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOffset]);

  const handleClick = useCallback(
    (e: any) => {
      if (moveSelected) {
        preventDefault(e);
        restartPosition();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [moveSelected]
  );

  useEffect(() => {
    const el = mainDiv.current;
    if (!el) return;
    el.addEventListener("mousedown", handleMouseDown, true);
    el.addEventListener("pointerdown", handleMouseDown, true);
    el.addEventListener("click", handleClick, true);
    el.addEventListener("touchend", handleClick, true);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown, true);
      el.removeEventListener("pointerdown", handleMouseDown, true);
      el.removeEventListener("click", handleClick, true);
      el.removeEventListener("touchend", handleClick, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleClick]);

  return (
    <div
      className="w-[150px] h-[110px] relative shrink-0 md:w-[300px] md:h-[200px] max-w-[150px] md:max-w-[300px] transition-all duration-300"
      ref={parentDiv}
      style={parentStyle}
    >
      <div
        className="w-[150px] h-[110px] relative shrink-0 md:w-[300px] md:h-[200px]"
        {...bind()}
        style={{
          animationName: selected ? "shake" : "none",
          animationDuration: "0.5s",
          animationTimingFunction: "ease-in-out",
          ...style,
        }}
        ref={mainDiv}
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
    </div>
  );
};

export default ItemCard;
