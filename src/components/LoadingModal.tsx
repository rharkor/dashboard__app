import { FC } from "react";

type LoadingModalType = {
  isLoading: boolean;
};

const LoadingModal: FC<LoadingModalType> = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-[var(--surface-section)]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
    </>
  );
};

export default LoadingModal;
