"use client"

import { div } from "framer-motion/client"
import { useRef, useEffect } from "react"

const SignaturePad = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    let isDrawing = false
    

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    const startDrawing = (e: MouseEvent | TouchEvent) => {
        e.preventDefault()
        isDrawing = true
        draw(e)
    }

    const endDrawing = (e: MouseEvent | TouchEvent) => {
        e.preventDefault()
        isDrawing = false
        const ctx = canvasRef.current?.getContext("2d")
        ctx?.beginPath() // reset path
    }

    const draw = (e: MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current
        if (!canvas || !isDrawing) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.strokeStyle = "#000"

        let x: number, y: number

        if (e instanceof MouseEvent) {
            x = e.offsetX
            y = e.offsetY
        } else {
            const rect = canvas.getBoundingClientRect()
            x = (e.touches[0].clientX - rect.left)
            y = (e.touches[0].clientY - rect.top)
        }

        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.addEventListener("mousedown", startDrawing)
        canvas.addEventListener("mouseup", endDrawing)
        canvas.addEventListener("mouseout", endDrawing)
        canvas.addEventListener("mousemove", draw)

        // Touch events for mobile
        canvas.addEventListener("touchstart", startDrawing)
        canvas.addEventListener("touchend", endDrawing)
        canvas.addEventListener("touchcancel", endDrawing)
        canvas.addEventListener("touchmove", draw)

        return () => {
            canvas.removeEventListener("mousedown", startDrawing)
            canvas.removeEventListener("mouseup", endDrawing)
            canvas.removeEventListener("mouseout", endDrawing)
            canvas.removeEventListener("mousemove", draw)

            canvas.removeEventListener("touchstart", startDrawing)
            canvas.removeEventListener("touchend", endDrawing)
            canvas.removeEventListener("touchcancel", endDrawing)
            canvas.removeEventListener("touchmove", draw)
        }
    }, [])

    return (
        <div className="h-30 relative">
            <canvas
                ref={canvasRef}
                width={300}
                height={100}
                className="border cursor-crosshair border-gray-300 rounded w-full touch-pan-y"
            />
         <button onClick={clearCanvas} type='button' className="btn btn-xs  btn-circle absolute z-10 top-2 right-2">X</button>

        </div>
     
    )
}

export default SignaturePad