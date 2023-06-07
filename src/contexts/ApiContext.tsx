import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  CreateItem,
  File,
  Item,
  ItemParent,
  UpdateItem,
} from "../../types/api";
import api from "@/utils/api";
import { toast } from "react-hot-toast";

export type ApiContextType = {
  items: Item[];
  fetchItems: (id?: string, token?: string | null) => Promise<Item[]>;
  itemsLoading: boolean;
  loadFile: (file: File, token?: string) => Promise<string | Blob>;
  createItem: (item: CreateItem) => Promise<void>;
  updateItem: (id: string, item: UpdateItem) => Promise<void>;
  fetchParent: (
    id: string,
    token?: string | null
  ) => Promise<ItemParent | null>;
  fetchItem: (id: string, token?: string | null) => Promise<Item | null>;
  deleteItem: (id: string, isGroup?: boolean) => Promise<void>;
  moveItem: (id: string, parentId: string) => Promise<void>;
  refreshToken: (id: string) => Promise<void>;
};

const ApiContextInitialValue: ApiContextType = {
  items: [],
  fetchItems: async () => [],
  itemsLoading: false,
  loadFile: async () => "",
  createItem: async () => {},
  updateItem: async () => {},
  fetchParent: async () => null,
  fetchItem: async () => null,
  deleteItem: async () => {},
  moveItem: async () => {},
  refreshToken: async () => {},
};

const ApiContext = createContext<ApiContextType>(ApiContextInitialValue);

const ApiProvider: FC<PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const fetchItems = useCallback(async (id?: string, token?: string | null) => {
    setItemsLoading(true);
    let data: Item[] = [];
    try {
      data = await api.fetch(
        `items${id ? `/${id}` : ""}${token ? "?token=" + token : ""}`
      );
      setItems(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch items");
    }
    setItemsLoading(false);
    return data;
  }, []);

  const loadFile = async (file: File, token?: string) => {
    const { path } = file;
    const res = await api.fetchPlain(
      path + (token ? `?token=${token}` : ""),
      undefined,
      { readBlob: true }
    );
    return res;
  };

  const createItem = async (item: CreateItem) => {
    const promise = new Promise<void>(async (resolve, reject) => {
      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("type", item.type);
      if (item.parent) formData.append("parent", JSON.stringify(item.parent));
      if (item.text) formData.append("text", item.text);
      if (item.logo) formData.append("logo", item.logo);
      if (item.file) formData.append("file", item.file);

      try {
        const res = await api.fetch(
          "items",
          {
            method: "POST",
            body: formData,
          },
          {
            noContentType: true,
          }
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
    await toast.promise(promise, {
      loading: "Creating item...",
      success: "Item created",
      error: (err) => err.error || "Failed to create item",
    });
  };

  const updateItem = async (id: string, item: UpdateItem) => {
    const promise = new Promise<void>(async (resolve, reject) => {
      const formData = new FormData();
      if (item.name) formData.append("name", item.name);
      if (item.type) formData.append("type", item.type);
      if (item.parent) formData.append("parent", JSON.stringify(item.parent));
      if (item.text) formData.append("text", item.text);
      if (item.logo) formData.append("logo", item.logo);
      if (item.file) formData.append("file", item.file);

      try {
        const res = await api.fetch(
          `items/${id}`,
          {
            method: "PUT",
            body: formData,
          },
          {
            noContentType: true,
          }
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
    await toast.promise(promise, {
      loading: "Updating item...",
      success: "Item updated",
      error: (err) => err.error || "Failed to update item",
    });
  };

  const fetchParent = useCallback(async (id: string, token?: string | null) => {
    const item = await api.fetch(
      `items/parent/${id}${token ? "?token=" + token : ""}`
    );
    return item;
  }, []);

  const fetchItem = useCallback(async (id: string, token?: string | null) => {
    const item = await api.fetch(
      `items/one/${id}${token ? "?token=" + token : ""}`
    );
    return item;
  }, []);

  const deleteItem = useCallback(async (id: string, isGroup?: boolean) => {
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const url = isGroup ? `items/group/${id}` : `items/${id}`;
        const res = await api.fetch(url, {
          method: "DELETE",
        });
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
    await toast.promise(promise, {
      loading: "Deleting item...",
      success: "Item deleted",
      error: (err) => err.message || "Failed to delete item",
    });
  }, []);

  const moveItem = useCallback(async (id: string, parentId: string) => {
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const res = await api.fetch(`items/move/${id}/${parentId}`, {
          method: "PUT",
        });
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
    await toast.promise(promise, {
      loading: "Moving item...",
      success: "Item moved",
      error: (err) => err.message || "Failed to move item",
    });
  }, []);

  const refreshToken = useCallback(async (id: string) => {
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const res = await api.fetch(`items/generate-token/${id}`, {
          method: "POST",
        });
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
    await toast.promise(promise, {
      loading: "Refreshing item...",
      success: "Link regenerated",
      error: (err) => err.message || "Failed to regenerated the link",
    });
  }, []);

  return (
    <ApiContext.Provider
      value={{
        items,
        fetchItems,
        itemsLoading,
        loadFile,
        createItem,
        updateItem,
        fetchParent,
        fetchItem,
        deleteItem,
        moveItem,
        refreshToken,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within a ApiProvider");
  }
  return context;
};

export { ApiProvider, useApi };
