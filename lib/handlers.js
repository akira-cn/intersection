import isct from './isct'

import {triggerEvent, triggerMouseEvent, triggerTouchEvent} from './events'

function handleEvent(data) {
  const {type, target} = data
  if(target) {
    const el = isct.getIsctEl(target)
    if(el.tagName !== 'INPUT' || el.type !== 'checkbox' && el.type !== 'radio'){
      //修正 input 的 change 事件被触发两次的 bug
      //因为 click 会触发一次 change，然后该 change 会被同步，于是又触发一次
      triggerEvent(el, type)
    }
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
  connect(data, ws) {
    const url = data.url
    if(url !== location.href || ws.userAction) {
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
  windowScroll(data, ws) {
    const {x, y, w, h} = data
    const width = document.documentElement.scrollWidth,
      height = document.documentElement.scrollHeight

    ws.isctEvent = true //防止反复推 scroll 消息
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
  input(data, ws){
    const {target, content, timestamp} = data

    if(target) {
      const el = isct.getIsctEl(target)
      if(!el.dataset.isctTime || el.dataset.isctTime < timestamp){
        if(el.value !== content){
          el.value = content
          ws.userAction = true
        }
        el.dataset.isctTime = timestamp
      }
    }
  },

  change: handleEvent,
  focus: function(data){
    const {target} = data

    if(target) {
      const el = isct.getIsctEl(target)

      el.focus()
    }
  },
  //blur: handleEvent,
  blur: function(data){
    const {target} = data

    if(target) {
      const el = isct.getIsctEl(target)

      el.blur()
    }
  },

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
