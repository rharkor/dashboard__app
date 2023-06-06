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
import { useApi } from "@/contexts/ApiContext";

interface ItemCardProps {
  item: Item;
  setFile: (file: FileWithContent | null) => void;
  editItem: (item: Item) => void;
  parentId?: string;
  noEdit?: boolean;
}

export const ItemCardWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col gap-4 p-2 md:p-8 p-card !bg-transparent hover:shadow-lg transition-all duration-300 hover:scale-105 h-full relative">
      {children}
    </div>
  );
};

const preventDefault = (e: any) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
};

const reduceTokens = [
  // "!w-[50px]",
  // "!h-[50px]",
  // "md:!w-[120px]",
  // "md:!h-[120px]",
  // "!rounded-full",
  "!bg-[var(--primary-color-lighten-op)]",
];

const ItemCard: FC<ItemCardProps> = ({
  item,
  setFile,
  editItem,
  parentId,
  noEdit,
}) => {
  const { type } = item;
  const { moveItem, fetchItems } = useApi();

  const [selected, setSelected] = useState(false);

  const mainDiv = useRef<HTMLDivElement>(null);
  const parentDiv = useRef<HTMLDivElement>(null);
  const moveOverlay = useRef<HTMLDivElement>(null);
  const [moveSelected, setMoveSelected] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [parentStyle, setParentStyle] = useState<React.CSSProperties>({});
  const [initialOffset, setInitialOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [isOver, setIsOver] = useState<null | string>(null);

  const restartPosition = () => {
    if (noEdit) return;
    setMoveSelected(false);
    const originalPosition = parentDiv.current?.getBoundingClientRect();
    const currentSize = mainDiv.current?.getBoundingClientRect();
    if (!originalPosition || !currentSize) return;
    setParentStyle({
      zIndex: 1000,
    });
    resetMoveOverlay();
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
    if (noEdit) return;
    preventDefault(e);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("pointerup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("pointermove", handleMouseMove);
  };

  const resetMoveOverlay = () => {
    //? Increase the mainDiv box
    mainDiv.current?.classList.remove(...reduceTokens);
    //? Remove hidden to all children
    Array.from(mainDiv.current?.children ?? []).forEach((child) => {
      child.classList.remove("hidden");
    });
    //? Hide the move overlay
    moveOverlay.current?.classList.add("hidden");
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (noEdit) return;
    preventDefault(e);
    const { clientX, clientY } = e;

    //? Determine if the mouse is hover another item
    const elsFromPoint = document.elementsFromPoint(clientX, clientY);
    let mouseOverItem = elsFromPoint.find(
      (el) => el.classList.contains("item-card") && el !== parentDiv.current
    );
    if (!mouseOverItem) {
      //? Check if hover arianne item
      mouseOverItem = elsFromPoint.find((el) =>
        el.classList.contains("arianne-item")
      );
    }

    const x = clientX - (initialOffset?.x ?? 0);
    const y = clientY - (initialOffset?.y ?? 0);
    if (mouseOverItem) {
      //? Reduce the mainDiv box
      mainDiv.current?.classList.add(...reduceTokens);
      //? Add hidden to all children
      Array.from(mainDiv.current?.children ?? []).forEach((child) => {
        child.classList.add("hidden");
      });
      //? Make visible the move overlay
      moveOverlay.current?.classList.remove("hidden");
      setIsOver((mouseOverItem as HTMLDivElement).dataset.id || "-1");
    } else {
      resetMoveOverlay();
      setIsOver(null);
    }

    setStyle({
      position: "fixed",
      top: `${y}px`,
      left: `${x}px`,
      zIndex: 1000,
      opacity: "0.9",
      backgroundColor: "#071426AA",
    });
    setParentStyle({
      maxWidth: "0",
      zIndex: 1000,
    });
  };

  const handleMouseDown: EventListenerOrEventListenerObject = (e) => {
    if (noEdit) return;
    preventDefault(e);
    let active = true;
    let moved = false;
    const release = () => {
      active = false;
    };
    const handleMove = () => {
      if (!active) return;
      moved = true;
    };

    document.addEventListener("mouseup", release);
    document.addEventListener("pointerup", release);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("pointermove", handleMove);
    setTimeout(() => {
      document.removeEventListener("mouseup", release);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("pointermove", handleMove);
      if (!active) return;

      //? If the cursor doesnt move, select the item
      if (!moved) {
        setSelected(true);
      }

      const mainDivClientRect = mainDiv.current?.getBoundingClientRect();
      if (!mainDivClientRect) return;
      const { clientX, clientY } = e as any;
      const offsetX = clientX - mainDivClientRect.x + window.scrollX;
      const offsetY = clientY - mainDivClientRect.y + window.scrollY;
      const newInitialOffset = { x: offsetX, y: offsetY };
      setInitialOffset(newInitialOffset);
      setMoveSelected(true);
    }, 200);
  };

  useEffect(() => {
    if (noEdit) return;
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
      if (noEdit) return;
      if (moveSelected) {
        preventDefault(e);

        if (isOver === null) {
          restartPosition();
        } else {
          moveItem(item.id.toString(), isOver).then(() => {
            fetchItems(parentId);
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [moveSelected, isOver]
  );

  useEffect(() => {
    if (noEdit) return;
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
      className={
        "w-[150px] h-[110px] relative shrink-0 md:w-[300px] md:h-[200px] max-w-[150px] md:max-w-[300px] transition-all duration-300 " +
        (item.type === "group" && !noEdit ? "item-card" : "")
      }
      ref={parentDiv}
      style={parentStyle}
      data-id={item.id.toString()}
    >
      <div
        className="w-[150px] h-[110px] relative shrink-0 md:w-[300px] md:h-[200px] duration-300 bg-[#071426FF]"
        style={{
          animationName: selected ? "shake" : "none",
          animationDuration: "0.5s",
          animationTimingFunction: "ease-in-out",
          transition:
            "width 0.5s ease-in-out, height 0.5s ease-in-out, background-color 0.5s ease-in-out, opacity 0.5s ease-in-out",
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
        {!noEdit && (
          <>
            <EditItemOverlay
              item={item}
              selected={selected}
              setSelected={setSelected}
              editItem={editItem}
            />
            <div
              className="absolute top-0 left-0 w-full h-full hidden"
              ref={moveOverlay}
            >
              <div className="relative h-full">
                <i className="pi pi-folder-open move-icon text-[var(--primary-color)] md:!text-7xl !text-4xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></i>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
