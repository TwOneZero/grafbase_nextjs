import { ReactNode } from "react";

const Loading = (): ReactNode => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-4 border-gray-300 border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
    </div>
  );
};

export default Loading;
