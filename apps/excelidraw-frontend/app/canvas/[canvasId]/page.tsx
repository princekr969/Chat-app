"use client"
import { useEffect, useRef, useState } from "react";
import { RectangleHorizontal, Circle, Minus, Undo, RotateCcw, Move, ZoomIn, ZoomOut, BoxSelect, Trash2, CircleXIcon } from "lucide-react";
import initDraw from "@/draw";

export default function CanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingAPI = useRef<ReturnType<typeof initDraw> | null>(null);
  const [mode, setMode] = useState<'move' | 'rectangle' | 'circle' | 'line'>('move');
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    if (canvasRef.current) {
      drawingAPI.current = initDraw(canvasRef.current);
      
      // Subscribe to viewport changes
      if(!drawingAPI.current) return ;
      const unsubscribe = drawingAPI.current.subscribeViewport((newViewport) => {
        setViewport(newViewport);
      });
      
      return () => {
        if (drawingAPI.current) {
          drawingAPI.current.cleanup();
          unsubscribe();
        }
      };
    }
  }, []);

  const handleModeChange = (newMode: 'move' | 'rectangle' | 'circle' | 'line') => {
    setMode(newMode);
    if (newMode === 'move') {
      drawingAPI.current?.setPanMode(true);
    } else {
      drawingAPI.current?.setPanMode(false);
      drawingAPI.current?.setDrawMode(newMode);
    }
  };

  const handleZoomIn = () => {
    drawingAPI.current?.zoomIn();
  };

  const handleZoomOut = () => {
    drawingAPI.current?.zoomOut();
  };

  const handleResetView = () => {
    drawingAPI.current?.resetView();
  };

  return (
    <div className="relative w-full h-screen bg-gray-800 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute w-full h-full inset-0 cursor-crosshair"
      ></canvas>
      
      {/* Controls */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg">
        {/* Mode Selector */}
        <div className="flex gap-1 border-r border-gray-700 pr-2">
          <button 
            onClick={() => handleModeChange('move')}
            className={`px-3 py-2 rounded ${mode === 'move' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            title="Pan Mode"
          >   
            <Move className="h-5 w-5 text-white"/>
          </button>
          <button 
            onClick={() => handleModeChange('rectangle')}
            className={`px-3 py-2 rounded ${mode === 'rectangle' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            title="Rectangle"
          >   
            <RectangleHorizontal className="h-5 w-5 text-white"/>
          </button>
          <button 
            onClick={() => handleModeChange('circle')}
            className={`px-3 py-2 rounded ${mode === 'circle' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            title="Circle"
          >
            <Circle className="h-5 w-5 text-white"/>
          </button>
          <button 
            onClick={() => handleModeChange('line')}
            className={`px-3 py-2 rounded ${mode === 'line' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            title="Line"
          >
            <Minus className="h-5 w-5 text-white"/> 
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex gap-1 border-r border-gray-700 pr-2">
          <button 
            onClick={handleZoomIn}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            title="Zoom In"
          >
            <ZoomIn className="h-5 w-5 text-white"/>
          </button>
          <button 
            onClick={handleZoomOut}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="h-5 w-5 text-white"/>
          </button>
          <button 
            onClick={handleResetView}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            title="Reset View"
          >
            <RotateCcw className="h-5 w-5 text-white"/>
          </button>
        </div>

        {/* Edit Controls */}
        <div className="flex gap-1 border-r border-gray-700 pr-2">
          <button 
            onClick={() => drawingAPI.current?.undoLastShape()}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            title="Undo"
          >
            <Undo className="h-5 w-5 text-white"/>
          </button>
          <button 
            onClick={() => drawingAPI.current?.clearShapes()}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            title="Clear All"
          >   
            <RotateCcw className="h-5 w-5 text-white"/>
          </button>
        </div>

        <div className="flex gap-1">
          <button 
          onClick={() => drawingAPI.current?.setDrawMode('select')}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          title="Select"
          >
            <BoxSelect className="h-5 w-5 text-white"/>
            </button>
            <button 
                onClick={() => drawingAPI.current?.deleteSelectedShapes()}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                title="Delete"
            >
            <Trash2 className="h-5 w-5 text-white"/>
                
            </button>
            <button 
                onClick={() => drawingAPI.current?.clearSelection()}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                title="Clear Selected"
            > 
            <CircleXIcon className="h-5 w-5 text-white"/>

            </button>
        </div>
      </div>

    </div>
  );
}