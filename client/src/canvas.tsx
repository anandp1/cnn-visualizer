import axios from "axios";
import { useEffect, useRef, useState } from "react";

const Canvas = () => {
  const [prediction, setPrediction] = useState<number | undefined>();

  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<any>(null);

  const startDraw = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);
  };
  const stopDraw = async () => {
    ctxRef.current.closePath();
    setDrawing(false);

    if (canvasRef.current) {
      const canvas = canvasRef.current;

      const matrix = Array.from(
        Array(canvas.height),
        () => new Array(canvas.width)
      );

      let imgd = ctxRef.current.getImageData(0, 0, canvas.width, canvas.height);
      let pix = imgd.data;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          // 4 because there are 4 channels
          let pos = (y * canvas.width + x) * 4; // position of the pixel

          matrix[y][x] = (pix[pos] + pix[pos + 1] + pix[pos + 2]) / 3; //red
          // pix[pos] = red
          // pix[pos + 1] = blue
          // pix[pos + 2]=  green
          // pix[pos + 3] = alpha
        }
      }

      const response = await axios.post("/predict", {
        matrix,
      });

      setPrediction(response.data.prediction);
    }
  };
  const draw = ({ nativeEvent }: any) => {
    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const clear = () => {
    if (canvasRef.current && ctxRef.current) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      // For supporting computers with higher screen densities, we double the screen density
      canvas.width = 238;
      canvas.height = 154;
      canvas.style.width = `${238}px`;
      canvas.style.height = `${154}px`;
      // Setting the context to enable us draw
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.lineCap = "round";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 20;
        ctxRef.current = ctx;
      }
    }
  }, []);

  return (
    <div className="w-60 border flex flex-col">
      <p className="text-white bg-black opacity-25">Draw Number Here</p>
      <div className="border bg-black opacity-25 border-white hover:opacity-100 hover:cursor-cell">
        <canvas
          onMouseDown={startDraw}
          onMouseUp={stopDraw}
          onMouseMove={draw}
          ref={canvasRef}
        />
      </div>
      {prediction && (
        <p className="text-white bg-black opacity-25">
          Prediction: {prediction}
        </p>
      )}
      <button onClick={clear} className="text-white bg-black opacity-25">
        Clear
      </button>
    </div>
  );
};

export default Canvas;
