"use client";

import { Spinner } from "flowbite-react";
import { PropsWithChildren, useEffect, useState } from "react";

// FIXME: on dev only
const Hydrate = ({ children }: PropsWithChildren) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <>{children}</>
  ) : (
    <div className="w-full h-screen grid place-items-center">
      <Spinner aria-label="Hydrating..." />
    </div>
  );
};

export default Hydrate;
