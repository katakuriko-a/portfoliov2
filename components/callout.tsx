import React from "react";

export default function Callout({ children } : {children : React.ReactNode}) {
  return (
    <div className="my-6 flex items-center rounded-md border py-2 px-4 border-l-4">
      <div>{children}</div>
    </div>
  );
}
