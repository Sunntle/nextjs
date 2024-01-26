import React from "react";

const MarketLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[3000px] flex items-center justify-center">{children}</div>
  );
};

export default MarketLayout;