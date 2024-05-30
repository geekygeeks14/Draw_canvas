import React, { useState, useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

const CanvasPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabled) return;
    setIsDrawing(true);
    const { clientX, clientY } = event;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      setPoints((prevPoints) => [...prevPoints, { x, y }]);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { clientX, clientY } = event;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      setPoints((prevPoints) => [...prevPoints, { x, y }]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const drawLines = (ctx: CanvasRenderingContext2D) => {
    if (points.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setPoints([]);
  };

  const exportImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.href = canvasRef.current.toDataURL('image/png');
      link.download = 'drawing.png';
      link.click();
    }
  };

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        };
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      drawLines(ctx);
    }
  }, [points]);

  const styling ={
    backgroundColor:'blue',
    border:'2px solid grey',
    color:"white",
    borderRadius:"5px",
    marginRight:"5px", 
    height:"30px"
  }
  
  return (
    <div>
      <h2>Draw Your Roof</h2>
      {/* button for start, stop, clear and export */}
        <div>
        <button onClick={() => setIsDrawingEnabled(true)} style={styling}>Start Drawing</button>
        <button onClick={() => setIsDrawingEnabled(false)} style={styling}>Stop Drawing</button>
        <button onClick={clearCanvas} style={styling}>Clear</button>
        <button onClick={exportImage} style={styling}>Export as Image</button>
        <input type="file" accept="image/*" onChange={uploadImage} />
      </div>
      
      {/* Canvas for draw the lines */}
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ border: '1px solid black' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default CanvasPage;
