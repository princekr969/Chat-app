"use client"
import { useEffect, useRef } from "react"

export default function Canvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if(canvasRef.current){
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if(!ctx) return;
            
            // Set canvas resolution to match its display size
            const resizeCanvas = () => {
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
            };
            
            resizeCanvas(); 
            window.addEventListener('resize', resizeCanvas);

            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;

            let mouseClicked = false;
            let startX = 0;
            let startY = 0;

            const getCanvasCoordinates = (e: MouseEvent) => {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;   // Scale for X coordinate
                const scaleY = canvas.height / rect.height; // Scale for Y coordinate
                return {
                    x: (e.clientX - rect.left) * scaleX,
                    y: (e.clientY - rect.top) * scaleY
                };
            };

            const handleMouseDown = (e: MouseEvent) => {
                mouseClicked = true;
                const coords = getCanvasCoordinates(e);
                startX = coords.x;
                startY = coords.y;
            };
            
            const handleMouseUp = (e: MouseEvent) => {
                mouseClicked = false;
                const coords = getCanvasCoordinates(e);
                console.log("End:", coords.x, coords.y);
            };

            const handleMouseMove = (e: MouseEvent) => {
                if(mouseClicked){
                    const coords = getCanvasCoordinates(e);
                    let width = coords.x - startX;
                    let height = coords.y - startY;
                    
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.strokeRect(startX, startY, width, height);
                }
            };

            canvas.addEventListener("mousedown", handleMouseDown);
            canvas.addEventListener("mouseup", handleMouseUp);
            canvas.addEventListener("mousemove", handleMouseMove);

            // Cleanup
            return () => {
                window.removeEventListener('resize', resizeCanvas);
                canvas.removeEventListener("mousedown", handleMouseDown);
                canvas.removeEventListener("mouseup", handleMouseUp);
                canvas.removeEventListener("mousemove", handleMouseMove);
            };
        }
    }, []);

    return (
        <div>
            <canvas 
                ref={canvasRef} 
                className="w-full h-screen bg-gray-800"
            ></canvas>
        </div>
    )
}