import { Rectangle, Line, Circle, Shape, Viewport } from '@repo/common/types';

// Create rectangle from mouse coordinates
const createRectangle = (startX: number, startY: number, endX: number, endY: number): Rectangle => {
  return {
    type: 'rectangle',
    x: Math.min(startX, endX),
    y: Math.min(startY, endY),
    width: Math.abs(endX - startX),
    height: Math.abs(endY - startY),
    color: '#ffffff',
    lineWidth: 2
  };
};

// Create circle from mouse coordinates
const createCircle = (startX: number, startY: number, endX: number, endY: number): Circle => {
  const radius = Math.sqrt(
    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
  );
  return {
    type: 'circle',
    x: startX,
    y: startY,
    radius: radius,
    color: '#ffffff',
    lineWidth: 2
  };
};

// Create line from mouse coordinates
const createLine = (startX: number, startY: number, endX: number, endY: number): Line => {
  return {
    type: 'line',
    x1: startX,
    y1: startY,
    x2: endX,
    y2: endY,
    color: '#ffffff',
    lineWidth: 2
  };
};

// Calculate bounding box for a shape (for selection)
const getShapeBounds = (shape: Shape): { minX: number; minY: number; maxX: number; maxY: number } => {
  switch (shape.type) {
    case 'rectangle':
      return {
        minX: shape.x,
        minY: shape.y,
        maxX: shape.x + shape.width,
        maxY: shape.y + shape.height
      };
    case 'circle':
      return {
        minX: shape.x - shape.radius,
        minY: shape.y - shape.radius,
        maxX: shape.x + shape.radius,
        maxY: shape.y + shape.radius
      };
    case 'line':
      return {
        minX: Math.min(shape.x1, shape.x2),
        minY: Math.min(shape.y1, shape.y2),
        maxX: Math.max(shape.x1, shape.x2),
        maxY: Math.max(shape.y1, shape.y2)
      };
  }
};

// Check if a point is inside a shape (for selection)
const isPointInShape = (shape: Shape, pointX: number, pointY: number, tolerance: number = 5): boolean => {
  switch (shape.type) {
    case 'rectangle': {
      // Check if point is inside rectangle (with tolerance)
      return (
        pointX >= shape.x - tolerance &&
        pointX <= shape.x + shape.width + tolerance &&
        pointY >= shape.y - tolerance &&
        pointY <= shape.y + shape.height + tolerance
      );
    }
    case 'circle': {
      // Check if point is within circle radius (with tolerance)
      const distance = Math.sqrt(
        Math.pow(pointX - shape.x, 2) + Math.pow(pointY - shape.y, 2)
      );
      return distance <= shape.radius + tolerance;
    }
    case 'line': {
      // Check if point is near the line using point-to-line distance formula
      const A = pointX - shape.x1;
      const B = pointY - shape.y1;
      const C = shape.x2 - shape.x1;
      const D = shape.y2 - shape.y1;
      
      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      
      let param = -1;
      if (lenSq !== 0) param = dot / lenSq;
      
      let xx, yy;
      
      if (param < 0) {
        xx = shape.x1;
        yy = shape.y1;
      } else if (param > 1) {
        xx = shape.x2;
        yy = shape.y2;
      } else {
        xx = shape.x1 + param * C;
        yy = shape.y1 + param * D;
      }
      
      const dx = pointX - xx;
      const dy = pointY - yy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance <= tolerance;
    }
  }
};

export default function initDraw(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // State
  let existingShapes: Shape[] = [];
  let isDrawing = false;
  let isPanning = false;
  let isSelecting = false;
  let isMovingShape = false;
  let startX = 0;
  let startY = 0;
  let currentShape: Shape | null = null;
  let selectionRect: Rectangle | null = null;
  
  // Selection state
  let selectedShapeIndex: number | null = null;
  let selectedShapes: number[] = []; // Array of shape indices
  let selectionOffset = { x: 0, y: 0 }; // Offset from shape position when moving
  
  // Viewport state
  let viewport: Viewport = {
    x: 0,
    y: 0,
    scale: 1
  };
  
  // Viewport subscribers
  let viewportSubscribers: ((viewport: Viewport) => void)[] = [];
  
  // Constants
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 10;
  const ZOOM_FACTOR = 1.2;
  const SELECTION_TOLERANCE = 5; // pixels in screen space

  // Convert world coordinates to screen coordinates
  const worldToScreen = (worldX: number, worldY: number) => {
    return {
      x: (worldX - viewport.x) * viewport.scale,
      y: (worldY - viewport.y) * viewport.scale
    };
  };

  // Convert screen coordinates to world coordinates
  const screenToWorld = (screenX: number, screenY: number) => {
    return {
      x: screenX / viewport.scale + viewport.x,
      y: screenY / viewport.scale + viewport.y
    };
  };

  // Draw selection highlight for a shape
  const drawSelection = (shape: Shape) => {
    ctx.save();
    ctx.strokeStyle = '#00a8ff'; // Bright blue for selection
    ctx.lineWidth = 1 ;
    ctx.setLineDash([5 , 5]); // Dashed line

    const bounds = getShapeBounds(shape);
    const screenMin = worldToScreen(bounds.minX, bounds.minY);
    const screenMax = worldToScreen(bounds.maxX, bounds.maxY);
    
    // Draw selection rectangle
    ctx.strokeRect(
      screenMin.x,
      screenMin.y,
      screenMax.x - screenMin.x,
      screenMax.y - screenMin.y
    );
    
    // Draw resize handles (corners)
    const handleSize = 6;
    ctx.fillStyle = '#00a8ff';
    ctx.setLineDash([]); // Solid for handles
    
    // Top-left
    ctx.fillRect(screenMin.x - handleSize/2, screenMin.y - handleSize/2, handleSize, handleSize);
    // Top-right
    ctx.fillRect(screenMax.x - handleSize/2, screenMin.y - handleSize/2, handleSize, handleSize);
    // Bottom-left
    ctx.fillRect(screenMin.x - handleSize/2, screenMax.y - handleSize/2, handleSize, handleSize);
    // Bottom-right
    ctx.fillRect(screenMax.x - handleSize/2, screenMax.y - handleSize/2, handleSize, handleSize);
    
    ctx.restore();
  };

  // Draw a single shape with viewport transformation
  const drawShape = (shape: Shape, index: number) => {
    ctx.save();
    
    // If shape is selected, draw with highlight color
    if (selectedShapes.includes(index)) {
      ctx.strokeStyle = '#ff6b6b'; // Highlight color for selected shapes
    } else {
      ctx.strokeStyle = shape.color || "white";
    }
    
    ctx.lineWidth = (shape.lineWidth || 1) * viewport.scale;

    switch (shape.type) {
      case 'rectangle': {
        const screen = worldToScreen(shape.x, shape.y);
        const screenWidth = shape.width * viewport.scale;
        const screenHeight = shape.height * viewport.scale;
        ctx.strokeRect(screen.x, screen.y, screenWidth, screenHeight);
        break;
      }
      case 'circle': {
        const screen = worldToScreen(shape.x, shape.y);
        const screenRadius = shape.radius * viewport.scale;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, screenRadius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case 'line': {
        const startScreen = worldToScreen(shape.x1, shape.y1);
        const endScreen = worldToScreen(shape.x2, shape.y2);
        ctx.beginPath();
        ctx.moveTo(startScreen.x, startScreen.y);
        ctx.lineTo(endScreen.x, endScreen.y);
        ctx.stroke();
        break;
      }
    }
    
    ctx.restore();
  };

  // Draw selection rectangle (for multi-select)
  const drawSelectionRect = () => {
    if (!selectionRect) return;
    
    ctx.save();
    ctx.strokeStyle = '#00a8ff';
    ctx.lineWidth = 1 / viewport.scale;
    ctx.setLineDash([5 / viewport.scale, 5 / viewport.scale]);
    
    const screen = worldToScreen(selectionRect.x, selectionRect.y);
    const screenWidth = selectionRect.width * viewport.scale;
    const screenHeight = selectionRect.height * viewport.scale;
    
    ctx.strokeRect(screen.x, screen.y, screenWidth, screenHeight);
    ctx.restore();
  };

  const redrawAllShapes = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw existing shapes
    existingShapes.forEach((shape, index) => drawShape(shape, index));
    
    // Draw selection highlights
    selectedShapes.forEach(index => {
      if (existingShapes[index]) {
        drawSelection(existingShapes[index]);
      }
    });
    
    // Draw current shape being drawn
    if (currentShape) {
      drawShape(currentShape, -1); // -1 means not in existingShapes
    }
    
    // Draw selection rectangle
    if (selectionRect) {
      drawSelectionRect();
    }
  };

  // Set canvas resolution to match its display size
  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    redrawAllShapes();
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const getCanvasCoordinates = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const screenX = (e.clientX - rect.left) * scaleX;
    const screenY = (e.clientY - rect.top) * scaleY;
    return screenToWorld(screenX, screenY);
  };

  // Zoom functionality
  const zoom = (factor: number, centerX?: number, centerY?: number) => {
    const oldScale = viewport.scale;
    viewport.scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, viewport.scale * factor));
    
    if (centerX !== undefined && centerY !== undefined) {
      const worldBefore = screenToWorld(centerX, centerY);
      const worldAfter = {
        x: centerX / viewport.scale + viewport.x,
        y: centerY / viewport.scale + viewport.y
      };
      
      viewport.x += (worldBefore.x - worldAfter.x);
      viewport.y += (worldBefore.y - worldAfter.y);
    }
    
    redrawAllShapes();
    notifyViewportSubscribers();
  };

  // Pan functionality
  const pan = (deltaX: number, deltaY: number) => {
    viewport.x -= deltaX / viewport.scale;
    viewport.y -= deltaY / viewport.scale;
    redrawAllShapes();
    notifyViewportSubscribers();
  };

  // Find shape at position (for selection)
  const findShapeAtPosition = (x: number, y: number): number | null => {
    // Convert tolerance from screen space to world space
    const worldTolerance = SELECTION_TOLERANCE / viewport.scale;
    
    // Check from last to first (so top-most shapes are selected first)
    for (let i = existingShapes.length - 1; i >= 0; i--) {
      if (isPointInShape(existingShapes[i], x, y, worldTolerance)) {
        return i;
      }
    }
    return null;
  };

  // Select shapes within rectangle (for multi-select)
  const selectShapesInRect = (rect: Rectangle) => {
    const selected: number[] = [];
    const bounds = getShapeBounds(rect);
    
    existingShapes.forEach((shape, index) => {
      const shapeBounds = getShapeBounds(shape);
      
      // Check if shape bounds intersect with selection rectangle
      const intersects = !(
        shapeBounds.maxX < bounds.minX ||
        shapeBounds.minX > bounds.maxX ||
        shapeBounds.maxY < bounds.minY ||
        shapeBounds.minY > bounds.maxY
      );
      
      if (intersects) {
        selected.push(index);
      }
    });
    
    selectedShapes = selected;
  };

  // Move selected shapes
  const moveSelectedShapes = (deltaX: number, deltaY: number) => {
    selectedShapes.forEach(index => {
      const shape = existingShapes[index];
      
      switch (shape.type) {
        case 'rectangle':
          shape.x += deltaX;
          shape.y += deltaY;
          break;
        case 'circle':
          shape.x += deltaX;
          shape.y += deltaY;
          break;
        case 'line':
          shape.x1 += deltaX;
          shape.y1 += deltaY;
          shape.x2 += deltaX;
          shape.y2 += deltaY;
          break;
      }
    });
  };

  // Draw mode
  let drawMode: 'select' | 'rectangle' | 'circle' | 'line' = 'select';

  const handleMouseDown = (e: MouseEvent) => {
    const coords = getCanvasCoordinates(e);
    startX = coords.x;
    startY = coords.y;
    
    if (isPanning) {
      isDrawing = false;
      isSelecting = false;
      isMovingShape = false;
    } else if (drawMode === 'select') {
      // Check if we clicked on a shape
      const shapeIndex = findShapeAtPosition(startX, startY);
      
      if (shapeIndex !== null) {
        // If shift is pressed, add to selection
        if (e.shiftKey) {
          if (selectedShapes.includes(shapeIndex)) {
            // Remove from selection if already selected
            selectedShapes = selectedShapes.filter(i => i !== shapeIndex);
          } else {
            // Add to selection
            selectedShapes.push(shapeIndex);
          }
        } else {
          // If not shift, select only this shape
          if (!selectedShapes.includes(shapeIndex)) {
            selectedShapes = [shapeIndex];
          }
        }
        
        // Calculate offset from shape position for smooth dragging
        const shape = existingShapes[shapeIndex];
        let shapeCenterX, shapeCenterY;
        
        if (shape.type === 'rectangle') {
          shapeCenterX = shape.x + shape.width / 2;
          shapeCenterY = shape.y + shape.height / 2;
        } else if (shape.type === 'circle') {
          shapeCenterX = shape.x;
          shapeCenterY = shape.y;
        } else { // line
          shapeCenterX = (shape.x1 + shape.x2) / 2;
          shapeCenterY = (shape.y1 + shape.y2) / 2;
        }
        
        selectionOffset.x = startX - shapeCenterX;
        selectionOffset.y = startY - shapeCenterY;
        
        isMovingShape = true;
        isDrawing = false;
        isSelecting = false;
      } else {
        // Start selection rectangle
        if (!e.shiftKey) {
          selectedShapes = []; // Clear selection if not holding shift
        }
        selectionRect = createRectangle(startX, startY, startX, startY);
        isSelecting = true;
        isDrawing = false;
        isMovingShape = false;
      }
    } else {
      // Start drawing a new shape
      isDrawing = true;
      isSelecting = false;
      isMovingShape = false;
      currentShape = null;
      selectedShapes = []; // Clear selection when starting to draw
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (isPanning) {
      // Nothing to do for panning
    } else if (isSelecting && selectionRect) {
      // Finalize selection rectangle
      const coords = getCanvasCoordinates(e);
      const endX = coords.x;
      const endY = coords.y;
      
      // Update selection rectangle
      selectionRect = createRectangle(startX, startY, endX, endY);
      
      // Select shapes within rectangle
      selectShapesInRect(selectionRect);
      
      // Clear selection rectangle
      selectionRect = null;
      isSelecting = false;
    } else if (isMovingShape) {
      // Finish moving shapes
      isMovingShape = false;
    } else if (isDrawing) {
      // Finish drawing shape
      isDrawing = false;
      const coords = getCanvasCoordinates(e);
      const endX = coords.x;
      const endY = coords.y;

      // Create final shape based on draw mode
      let finalShape: Shape;
      switch (drawMode) {
        case 'rectangle':
          finalShape = createRectangle(startX, startY, endX, endY);
          break;
        case 'circle':
          finalShape = createCircle(startX, startY, endX, endY);
          break;
        case 'line':
          finalShape = createLine(startX, startY, endX, endY);
          break;
        default:
          return;
      }

      // Add to existing shapes if it has valid dimensions
      const minSize = 5 / viewport.scale;
      if (
        (finalShape.type === 'rectangle' && finalShape.width > minSize && finalShape.height > minSize) ||
        (finalShape.type === 'circle' && finalShape.radius > minSize) ||
        (finalShape.type === 'line' &&
          Math.abs(endX - startX) > minSize &&
          Math.abs(endY - startY) > minSize)
      ) {
        existingShapes.push(finalShape);
      }

      currentShape = null;
    }
    
    redrawAllShapes();
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const screenX = (e.clientX - rect.left) * scaleX;
    const screenY = (e.clientY - rect.top) * scaleY;
    
    if (isPanning && e.buttons === 1) {
      // Pan with mouse drag
      pan(e.movementX * scaleX, e.movementY * scaleY);
    } else if (isSelecting && e.buttons === 1) {
      // Update selection rectangle
      const coords = screenToWorld(screenX, screenY);
      const endX = coords.x;
      const endY = coords.y;
      
      selectionRect = createRectangle(startX, startY, endX, endY);
      redrawAllShapes();
    } else if (isMovingShape && e.buttons === 1 && selectedShapes.length > 0) {
      // Move selected shapes
      const coords = screenToWorld(screenX, screenY);
      const currentX = coords.x;
      const currentY = coords.y;
      
      // Calculate delta movement
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      
      // Move shapes
      moveSelectedShapes(deltaX, deltaY);
      
      // Update start position for next move
      startX = currentX;
      startY = currentY;
      
      redrawAllShapes();
    } else if (isDrawing && e.buttons === 1) {
      // Update drawing preview
      const coords = screenToWorld(screenX, screenY);
      const endX = coords.x;
      const endY = coords.y;

      // Update current shape based on draw mode
      switch (drawMode) {
        case 'rectangle':
          currentShape = createRectangle(startX, startY, endX, endY);
          break;
        case 'circle':
          currentShape = createCircle(startX, startY, endX, endY);
          break;
        case 'line':
          currentShape = createLine(startX, startY, endX, endY);
          break;
      }

      redrawAllShapes();
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const screenX = (e.clientX - rect.left) * scaleX;
    const screenY = (e.clientY - rect.top) * scaleY;
    
    const zoomFactor = e.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
    zoom(zoomFactor, screenX, screenY);
  };

  // Notify subscribers of viewport changes
  const notifyViewportSubscribers = () => {
    viewportSubscribers.forEach(callback => callback({ ...viewport }));
  };

  // Public API
  const api = {
    cleanup: () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("wheel", handleWheel);
    },
    
    setDrawMode: (mode: 'select' | 'rectangle' | 'circle' | 'line') => {
      drawMode = mode;
      isPanning = false;
      
      // Update cursor based on mode
      if (mode === 'select') {
        canvas.style.cursor = 'default';
      } else {
        canvas.style.cursor = 'crosshair';
        selectedShapes = []; // Clear selection when switching to draw mode
      }
    },
    
    setPanMode: (enabled: boolean) => {
      isPanning = enabled;
      canvas.style.cursor = enabled ? 'grab' : (drawMode === 'select' ? 'default' : 'crosshair');
      selectedShapes = []; // Clear selection when panning
    },
    
    getShapes: (): Shape[] => {
      return [...existingShapes];
    },
    
    clearShapes: () => {
      existingShapes = [];
      selectedShapes = [];
      redrawAllShapes();
    },
    
    undoLastShape: () => {
      if (existingShapes.length > 0) {
        existingShapes.pop();
        // Remove any selection that might be pointing to the removed shape
        selectedShapes = selectedShapes.filter(index => index < existingShapes.length);
        redrawAllShapes();
      }
    },
    
    // Selection management
    deleteSelectedShapes: () => {
      if (selectedShapes.length === 0) return;
      
      // Remove shapes from highest index to lowest to avoid index shifting issues
      selectedShapes.sort((a, b) => b - a).forEach(index => {
        existingShapes.splice(index, 1);
      });
      
      selectedShapes = [];
      redrawAllShapes();
    },
    
    getSelectedShapes: (): Shape[] => {
      return selectedShapes.map(index => existingShapes[index]).filter(Boolean);
    },
    
    clearSelection: () => {
      selectedShapes = [];
      redrawAllShapes();
    },
    
    // Viewport controls
    zoomIn: () => {
      zoom(ZOOM_FACTOR, canvas.width / 2, canvas.height / 2);
    },
    
    zoomOut: () => {
      zoom(1 / ZOOM_FACTOR, canvas.width / 2, canvas.height / 2);
    },
    
    resetView: () => {
      viewport = { x: 0, y: 0, scale: 1 };
      redrawAllShapes();
      notifyViewportSubscribers();
    },
    
    getViewport: (): Viewport => ({ ...viewport }),
    
    // Subscribe to viewport changes
    subscribeViewport: (callback: (viewport: Viewport) => void) => {
      viewportSubscribers.push(callback);
      callback({ ...viewport });
      
      return () => {
        viewportSubscribers = viewportSubscribers.filter(cb => cb !== callback);
      };
    }
  };

  // Add event listeners
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("wheel", handleWheel, { passive: false });

  return api;
}