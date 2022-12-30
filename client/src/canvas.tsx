import { useLayoutEffect, useRef, useState } from "react";
import Drawing from "./drawing";

const Canvas = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [prediction, setPrediction] = useState<number | undefined>();

  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
      setHeight(ref.current.offsetHeight);
    }
  }, []);

  return (
    <div className="w-60 border  flex flex-col">
      <p className="text-white bg-black opacity-25">Draw Number Here</p>
      <div
        className="border bg-black opacity-25 border-white hover:opacity-100 hover:cursor-cell"
        ref={ref}
      >
        <Drawing width={width} height={height} setPrediction={setPrediction} />
      </div>
      {prediction && (
        <p className="text-white bg-black opacity-25">
          Prediction: {prediction}
        </p>
      )}
      <button className="text-white bg-black opacity-25">Clear</button>
    </div>
  );
};

export default Canvas;
