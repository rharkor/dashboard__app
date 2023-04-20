import { FC, PropsWithChildren } from "react";

const Base: FC<PropsWithChildren> = ({ children }) => {
  return <div className="p-4 md:p-8">{children}</div>;
};

export default Base;
