import { useEffect, useRef, useState } from "react";

interface DrawingProps {
  width: number;
  height: number;
}

export default function Drawing({ width, height }: DrawingProps) {
  //   console.log(width, height);
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
  };
  const draw = ({ nativeEvent }: any) => {
    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;
    // console.log(ctxRef);
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
      console.log(canvas.width);
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;
      // Setting the context to enable us draw
      const ctx = canvas.getContext("2d");

      //   console.log(ctx);

      if (ctx) {
        // ctx.scale(2, 2);
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
