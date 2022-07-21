import React, { useEffect } from "react";

export const useCustomEffect = (func, deps) => {
  const didMount = React.useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};
