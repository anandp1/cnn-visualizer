import { useEffect, useRef, useState } from "react";

interface DrawingProps {
  width: number;
  height: number;
}

export default function Drawing({ width, height }: DrawingProps) {
  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<any>(null);

  const startDraw = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);
  };
  const stopDraw = () => {
    ctxRef.current.closePath();
    setDrawing(false);
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      const matrix = Array.from(
        Array(canvas.height),
        () => new Array(canvas.width)
      );

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          let imgd = ctxRef.current.getImageData(
            x,
            y,
            canvas.width,
            canvas.height
          );
          let pix = imgd.data;
          // 4 because there are 4 channels
          let pos = (y * canvas.width + x) * 4; // position of the pixel

          matrix[y][x] = (pix[pos] + pix[pos + 1] + pix[pos + 2]) / 3; //red
          // pix[pos] = red
          // pix[pos + 1] = blue
          // pix[pos + 2]=  green
          // pix[pos + 3] = alpha
        }
      }
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
    <>
      <canvas
        onMouseDown={startDraw}
        onMouseUp={stopDraw}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </>
  );
}
