import React, { useEffect, useRef } from 'react'

import {useSocket} from './Room'

import './Whiteboard.scss'

const Whiteboard = () => {
  const {socket} = useSocket() 
  const canvasRef = useRef(null)
  const colorsRef = useRef(null)
  const eraserRef = useRef(null)
  
  useEffect(() => {
    // --------------- getContext() method returns a drawing context on the canvas-----
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // ----------------------- Colors --------------------------------------------------
    const eraser = document.getElementById('eraser')
    const colors = document.getElementsByClassName('color')

    // set the current color
    const current = {
      color: 'black'
    }

    const getEraser = () => {
      current.color = 'eraser'
    }

    eraser.addEventListener('click', getEraser, false)

    // helper that will update the current color
    const onColorUpdate = (e) => {
      current.color = e.target.className.split(' ')[1]
    }

    // loop through the color elements and add the click event listeners
    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener('click', onColorUpdate, false)
    }
    let drawing = false

    // -------------- drawing function --------------
    const drawLine = (x0, y0, x1, y1, color, emit) => {
    if (color === 'eraser') {
      context.clearRect(x0, y0, 10, 10)
    } else {
      context.beginPath()
      context.moveTo(x0, y0)
      context.lineTo(x1, y1)
      context.strokeStyle = color
      context.lineWidth = 2
      context.stroke()
      context.closePath()
    }

    if (!emit) { return }

    const w = canvasRef.current.width
    const h = canvasRef.current.height


    if (!!socket) socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color
    })
    }

    // ---------------- mouse movement --------------------------------------

    const onMouseDown = (e) => {
      drawing = true
      current.x = e.clientX || e.touches[0].clientX
      current.y = e.clientY || e.touches[0].clientY
    }

    const onMouseMove = (e) => {
      if (!drawing) { return }
      drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true)
      current.x = e.clientX || e.touches[0].clientX
      current.y = e.clientY || e.touches[0].clientY
    }

    const onMouseUp = (e) => {
      if (!drawing) { return }
      drawing = false
      drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true)
    }

    // ----------- limit the number of events per second -----------------------
    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime()
      return function () {
        const time = new Date().getTime()

        if ((time - previousCall) >= delay) {
          previousCall = time
          callback.apply(null, arguments)
        }
      }
    }

    // -----------------add event listeners to our canvas ----------------------
    canvas.addEventListener('mousedown', onMouseDown, false)
    canvas.addEventListener('mouseup', onMouseUp, false)
    canvas.addEventListener('mouseout', onMouseUp, false)
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false)

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', onMouseDown, false)
    canvas.addEventListener('touchend', onMouseUp, false)
    canvas.addEventListener('touchcancel', onMouseUp, false)
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false)

    // -------------- make the canvas fill its parent component -----------------
    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', onResize, false)
    onResize()

    // -------------- handle socket events --------------
    const onDrawingEvent = (data) => {
      const w = canvasRef.current.width
      const h = canvasRef.current.height
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color)
    }

    if (!!socket) socket.on('drawing', onDrawingEvent)

    return () => {
      // remove event listeners on unmount
      eraser.removeEventListener('click', getEraser, false)
      for (let i = 0; i < colors.length; i++) {
        colors[i].removeEventListener('click', onColorUpdate, false)
      }
      canvas.removeEventListener('mousedown', onMouseDown, false)
      canvas.removeEventListener('mouseup', onMouseUp, false)
      canvas.removeEventListener('mouseout', onMouseUp, false)
      canvas.removeEventListener('mousemove', throttle(onMouseMove, 10), false)
      canvas.removeEventListener('touchstart', onMouseDown, false)
      canvas.removeEventListener('touchend', onMouseUp, false)
      canvas.removeEventListener('touchcancel', onMouseUp, false)
      canvas.removeEventListener('touchmove', throttle(onMouseMove, 10), false)
      window.removeEventListener('resize', onResize, false)
    }
    
  }, [socket])

  return (
    <>
      <div className='toolbox'>

        <details className='tool tool__pen'>
          <summary>Pen</summary>
          <ul className='colors' ref={colorsRef}>
            <div className='color black' />
            <div className='color red' />
            <div className='color green' />
            <div className='color blue' />
            <div className='color yellow' />
          </ul>
        </details>

        <div 
          className='tool tool__eraser' 
          ref={eraserRef} 
          id='eraser'
        >
          Eraser
        </div>

      </div>

      <canvas className='whiteboard' ref={canvasRef} />
    </>
  )
}

export default Whiteboard