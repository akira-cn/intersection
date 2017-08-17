import isct from './isct'

import {triggerEvent, triggerMouseEvent, triggerTouchEvent} from './events'

function handleEvent(data) {
  const {type, target} = data
  if(target) {
    const el = isct.getIsctEl(target)
    triggerEvent(el, type)
  }
}

function handleMouseEvent(data) {
  const {type, target, args} = data
  if(target) {
    const el = isct.getIsctEl(target)
    if(args.relatedTraget) {
      args.relatedTraget = isct.getIsctEl(target)
    }
    triggerMouseEvent(el, type, args)
  }
}

function handleTouchEvent(data) {
  const {type, target, args} = data
  if(target) {
    const el = isct.getIsctEl(target)
    if(args.touches) {
      args.touches.forEach((o) => {
        o.target = isct.getIsctEl(o.target)
      })
    }
    if(args.targetTouches) {
      args.targetTouches.forEach((o) => {
        o.target = isct.getIsctEl(o.target)
      })
    }
    if(args.changedTouches) {
      args.changedTouches.forEach((o) => {
        o.target = isct.getIsctEl(o.target)
      })
    }
    triggerTouchEvent(el, type, args)
  }
}

export default {
  connect(data) {
    const url = data.url
    if(url !== location.href) {
      location.href = url
    }
  },
  disconnect(data) {
    // //延迟一下再刷新，这样如果有跳转就先跳转走
    // if(ws.readyState === WebSocket.OPEN){
    //   ws.close()
    // }
    // setTimeout(()=> {
    //   location.reload()
    // }, 500)
  },
  windowScroll(data) {
    const {x, y, w, h} = data
    const width = document.documentElement.clientWidth,
      height = document.documentElement.clientHeight

    window.scrollTo(Math.round(x * width / w), Math.round(y * height / h))
  },
  scroll(data) {
    // console.log(data)
    const {x, y, w, h, target} = data
    if(target) {
      const el = isct.getIsctEl(target)
      const width = el.scrollWidth,
        height = el.scrollHeight

      el.scrollLeft = Math.round(x * width / w)
      el.scrollTop = Math.round(y * height / h)
    }
  },
  input(data){
    const {target, content, timestamp} = data

    if(target) {
      const el = isct.getIsctEl(target)
      if(!el.dataset.isctTime || el.dataset.isctTime < timestamp){
        el.value = content
        el.dataset.isctTime = timestamp
      }
    }
  },

  change: handleEvent,

  click: handleMouseEvent,
  mousedown: handleMouseEvent,
  mouseup: handleMouseEvent,
  mousemove: handleMouseEvent,
  mouseover: handleMouseEvent,
  mouseout: handleMouseEvent,
  mouseenter: handleMouseEvent,
  mouseleave: handleMouseEvent,

  touchstart: handleTouchEvent,
  touchend: handleTouchEvent,
  touchmove: handleTouchEvent,
}
