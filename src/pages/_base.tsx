import LoadingModal from "@/components/LoadingModal";
import { useAuth } from "@/contexts/AutchContext";
import { FC, PropsWithChildren } from "react";

const Base: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useAuth();

  return (
    <div className="p-4 md:p-8">
      {children}
      <LoadingModal isLoading={isLoading} />
    </div>
  );
};

export default Base;
