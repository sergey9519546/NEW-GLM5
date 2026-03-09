'use client'

import { useState, useRef, useEffect } from 'react'

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF',
  '#C0C0C0', '#808080', '#FF8080', '#FFFF80', '#80FF80', '#80FFFF', '#8080FF', '#FF80FF',
]

const TOOLS = ['pencil', 'brush', 'eraser', 'fill', 'line', 'rectangle', 'ellipse', 'picker'] as const
type Tool = typeof TOOLS[number]

export function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<Tool>('pencil')
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(2)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Fill with white
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])
  
  const getPos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }
  
  const startDrawing = (e: React.MouseEvent) => {
    const pos = getPos(e)
    setIsDrawing(true)
    setLastPos(pos)
    
    if (tool === 'fill') {
      // Simple fill (just fills entire canvas for demo)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (ctx) {
        ctx.fillStyle = color
        ctx.fillRect(0, 0, canvas!.width, canvas!.height)
      }
    }
  }
  
  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    const pos = getPos(e)
    
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color
    ctx.lineWidth = tool === 'brush' ? brushSize * 2 : brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      ctx.beginPath()
      ctx.moveTo(lastPos.x, lastPos.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
    
    setLastPos(pos)
  }
  
  const stopDrawing = () => {
    setIsDrawing(false)
  }
  
  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }
  
  return (
    <div className="paint-app">
      <div className="paint-toolbar">
        <div className="paint-tools">
          {TOOLS.map(t => (
            <button
              key={t}
              className={`paint-tool ${tool === t ? 'active' : ''}`}
              onClick={() => setTool(t)}
              title={t}
            >
              {t.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
        <div className="paint-options">
          <label>
            Size:
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
            />
          </label>
          <button className="win95-button small" onClick={clearCanvas}>
            Clear
          </button>
        </div>
      </div>
      
      <div className="paint-main">
        <div className="paint-colors">
          {COLORS.map((c, i) => (
            <div
              key={i}
              className={`paint-color ${color === c ? 'active' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        
        <div className="paint-canvas-container">
          <canvas
            ref={canvasRef}
            width={500}
            height={300}
            className="paint-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
      
      <div className="paint-statusbar">
        <span>Tool: {tool}</span>
        <span>Color: {color}</span>
      </div>
    </div>
  )
}
