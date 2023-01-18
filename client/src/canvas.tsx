import axios from "axios";
import { useEffect, useRef, useState } from "react";

const Canvas = () => {
  const [prediction, setPrediction] = useState<number | undefined>();

  const [matrix, setMatrix] = useState<number[][]>([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);
  Array.from({ length: 10 }, () => Array(10).fill(0));

  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<any>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const ctx2Ref = useRef<any>(null);

  const startDraw = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const drawMatrix = () => {
    const z = matrix.map((c) =>
      c.map((c) => [
        Math.abs(c * 255),
        Math.abs(c * 255),
        Math.abs(c * 255),
        255,
      ])
    );
    const i = new ImageData(Uint8ClampedArray.from(z.flat(2)), 26);
    ctx2Ref.current.putImageData(i, 0, 0);
    // ctx2Ref.current.scale(16, 16);
    ctx2Ref.current.webkitImageSmoothingEnabled = false;
    ctx2Ref.current.mozImageSmoothingEnabled = false;
    ctx2Ref.current.imageSmoothingEnabled = false;
    ctx2Ref.current.drawImage(canvas2Ref, 0, 0);
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

          matrix[y][x] = (pix[pos] + pix[pos + 1] + pix[pos + 2]) / 3; // grayscale
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

      console.log(response.data);
      setMatrix(response.data.modelLayerOutputs["firstCovLayer"]);
      drawMatrix();
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
    if (canvasRef.current && canvas2Ref.current) {
      const canvas = canvasRef.current;
      const canvas2 = canvas2Ref.current;
      // For supporting computers with higher screen densities, we double the screen density
      canvas.width = 238;
      canvas.height = 154;
      canvas.style.width = `${238}px`;
      canvas.style.height = `${154}px`;

      canvas2.width = 1000;
      canvas2.height = 1000;
      canvas2.style.width = `${1000}px`;
      canvas2.style.height = `${1000}px`;
      // Setting the context to enable us draw
      const ctx = canvas.getContext("2d");
      const ctx2 = canvas2.getContext("2d");

      if (ctx) {
        ctx.lineCap = "round";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 20;
        ctxRef.current = ctx;
      }
      if (ctx2) {
        ctx2Ref.current = ctx2;
      }
    }
  }, []);

  return (
    <>
      <canvas
        onMouseDown={startDraw}
        onMouseUp={stopDraw}
        onMouseMove={draw}
        ref={canvas2Ref}
      />
      <div className="w-60 border flex flex-col absolute right-0 bottom-0">
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
    </>
  );
};

export default Canvas;
