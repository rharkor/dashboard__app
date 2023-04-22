export type File = {
  path: string;
  size: number;
  encoding: string;
  filename: string;
  mimetype: string;
  fieldname: string;
  destination: string;
  originalname: string;
};

type ItemBase = {
  id: number;
  name: string;
  logo?: File[];
  parent?: Item;
  children?: Item[];
};

export type ItemWithText = ItemBase & {
  type: "link" | "copy" | "password";
  text: string;
};

export type ItemWithFile = ItemBase & {
  type: "view" | "file";
  file: File[];
};

export type ItemGroup = ItemBase & {
  type: "group";
};

export type Item = ItemWithText | ItemWithFile | ItemGroup;

export type ItemParent = {
  id: number;
  name: string;
  parents: Omit<ItemParent, "parents">[];
};

export type itemListType =
  | "link"
  | "copy"
  | "view"
  | "file"
  | "group"
  | "password";
export const itemList: itemListType[] = [
  "group",
  "link",
  "copy",
  "view",
  "file",
  "password",
];

export type CreateItem = {
  name: string;
  type: itemListType;
  text?: string;
  file?: any;
  logo?: any;
  parent?: Item | ItemParent;
};

export type UpdateItem = {
  name?: string;
  type?: itemListType;
  text?: string;
  file?: any;
  logo?: any;
  parent?: Item | ItemParent;
};
