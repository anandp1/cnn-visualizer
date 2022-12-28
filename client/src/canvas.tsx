import { useEffect, useRef, useState } from "react";
import Drawing from "./drawing";

const Canvas = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (divRef.current) {
      setWidth(divRef.current.offsetWidth);
      setHeight(divRef.current.offsetHeight);
      //   console.log(width, height);
    }
  }, [height, width]);

  return (
    <div className="w-60 border bg-black opacity-25 flex flex-col">
      <p className="text-white">Draw Number Here</p>
      {/* {width > 0 && height > 0 && ( */}
      <div className="bg-black border border-white opacity-100" ref={divRef}>
        <Drawing width={width} height={height} />
      </div>
      {/* )} */}
    </div>
  );
};

export default Canvas;
