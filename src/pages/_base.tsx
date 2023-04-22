import LoadingModal from "@/components/LoadingModal";
import { useAuth } from "@/contexts/AuthContext";
import { FC, PropsWithChildren } from "react";

const Base: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useAuth();

  return (
    <div className="p-4 sm:p-8 lg:p-16 max-w-7xl mx-auto">
      {children}
      <LoadingModal isLoading={isLoading} />
    </div>
  );
};

export default Base;
