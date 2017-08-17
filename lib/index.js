const scriptEls = document.getElementsByTagName('script')
const theScriptEl = scriptEls[scriptEls.length - 1]

// <script ... data-isct-server="ws://127.0.0.1" data-isct-token="your token"></script>
const server = theScriptEl.dataset.isctServer
const token = theScriptEl.dataset.isctToken || 'default'

import {getMouseEventArgs, getTouchEventArgs} from './events'

import handlers from './handlers'

import isct from './isct'

if(server) {
  const els = document.querySelectorAll('*')

  // 给每个元素增加一个 data-isct-id
  els.forEach((el) => {
    isct.setIsctEl(el)
    if(el.tagName === 'A' && el.href) {
      // 对 a 标签进行处理
      el.addEventListener('click', (evt) => {
        location.href = el.href
        evt.preventDefault()
      })
    }
  })

  // 要检查 DOM 元素变化，给新的元素添加 data-isct-id
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver

  const observer = new MutationObserver((mobjs) => {
    mobjs.forEach((m) => {
      if(m.addedNodes) {
        m.addedNodes.forEach((el) => {
          if(el.nodeType === 1) {
            isct.setIsctEl(el)
          }
        })
        m.removedNodes.forEach((el) => {
          if(el.nodeType === 1) {
            isct.removeIsctEl(el)
          }
        })
      }
    })
  })

  observer.observe(document, {
    attributes: true,
    attributeOldValue: true,
    childList: true,
    characterData: true,
    characterDataOldValue: true,
    subtree: true,
  })

  const ws = new WebSocket(server)

  function sendMessage(message) {
    if(ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  ws.onopen = function () {
    // console.log("Connection open ...")
    sendMessage({type: 'connect', token, url: location.href})

    window.addEventListener('unload', () => {
      sendMessage({type: 'disconnect'})
    })

    window.addEventListener('scroll', evt => {
      const x = window.scrollX || window.pageXOffset,
        y = window.scrollY || window.pageYOffset

      const h = document.documentElement.clientHeight,
        w = document.documentElement.clientWidth

      if(evt.isTrusted) {
        sendMessage({type: 'windowScroll', x, y, h, w})
      }
    })

    document.documentElement.addEventListener('scroll', (evt) => {
      const x = evt.target.scrollLeft,
        y = evt.target.scrollTop

      const h = evt.target.scrollHeight,
        w = evt.target.scrollWidth

      const target = evt.target.dataset.isctId

      if(evt.isTrusted){
        sendMessage({type: 'scroll', x, y, h, w, target})
      }
    }, true)

    function mouseEventListener(evt) {
      const target = evt.target.dataset.isctId,
        type = evt.type

      const args = getMouseEventArgs(evt)

      if(type === 'click' && evt.target.tagName === 'LABEL') {
        // 不发送 label 的 click 事件
        // 因为 label 的 click 是会关联触发 input 的事件
        // label 的事件在 chrome 下本身疑似 bug
        // 接收方收到 label 的 click 事件后执行 click
        // 会触发关联的 input 的 click 事件时把该事件当成是用户手工操作的
        return;
      }

      if(evt.isTrusted) {
        sendMessage({type, target, args})
      }
    }

    function touchEventListener(evt) {
      const target = evt.target.dataset.isctId,
        type = evt.type

      const args = getTouchEventArgs(evt)

      if(evt.isTrusted) {
        sendMessage({type, target, args})
      }
    }

    ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout',
      'mouseenter', 'mouseleave'].forEach((type) => {
        document.documentElement.addEventListener(type, mouseEventListener, true)
      })

    ;['touchstart', 'touchend', 'touchmove'].forEach((type) => {
      document.documentElement.addEventListener(type, touchEventListener, true)
    })

    document.documentElement.addEventListener('input', evt => {
      const content = evt.target.value || evt.target.innerHTML,
            target = evt.target.dataset.isctId,
            type = evt.type

      if(evt.isTrusted) {
        sendMessage({type, target, content, timestamp: Date.now()})
      }
    }, true)

    document.documentElement.addEventListener('change', evt => {
      const target = evt.target.dataset.isctId,
            type = evt.type

      if(evt.isTrusted) {
        sendMessage({type, target})
      }      
    })
  }

  ws.onmessage = function (evt) {
    // console.log(`Received Message: ${evt.data}`)

    const data = JSON.parse(evt.data)

    handlers[data.type](data, ws)
  }

  // ws.onclose = function(evt) {
  //   console.log("Connection closed.")
  // }
} else {
  // console.log('do nothing')
}
