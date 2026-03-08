import { useState, useEffect } from "react";

export default function useScreenDimensions() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function update() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return dimensions;
}
