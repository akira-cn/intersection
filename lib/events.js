const defaultMouseEventOptions = {
  bubbles: true,
  cancelable: true,
  view: window
}

export function triggerEvent(el, type, options = {}) {
  options = Object.assign({}, defaultMouseEventOptions, options)

  const event = new Event(type, options)
  el.dispatchEvent(event)  
}

export function triggerMouseEvent(el, type = 'click', options = {}) {
  options = Object.assign({}, defaultMouseEventOptions, options)

  const mouseEvent = new MouseEvent(type, options)
  el.dispatchEvent(mouseEvent)
}

export function triggerTouchEvent(el, type = 'touchstart', options) {
  options = Object.assign({}, defaultMouseEventOptions, options)

  // console.log(options)
  if(options.touches) {
    options.touches = options.touches.map((o) => {
      return new Touch(o)
    })
  }
  if(options.targetTouches) {
    options.targetTouches = options.targetTouches.map((o) => {
      return new Touch(o)
    })
  }
  if(options.changedTouches) {
    options.changedTouches = options.changedTouches.map((o) => {
      return new Touch(o)
    })
  }

  const touchEvent = new TouchEvent(type, options)
  el.dispatchEvent(touchEvent)
}

export function getMouseEventArgs(evt) {
  // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
  let {altKey, button, buttons, clientX, clientY,
        ctrlKey, metaKey, movementX, movementY,
        offsetX, offsetY, pageX, pageY, region,
        relatedTraget, screenX, screenY, shiftKey, x, y} = evt

  if(relatedTraget && relatedTraget.nodeType === 1) {
    relatedTraget = relatedTraget.dataset.isctId
  } else {
    relatedTraget = null
  }

  return {altKey,
    button,
    buttons,
    clientX,
    clientY,
    ctrlKey,
    metaKey,
    movementX,
    movementY,
    offsetX,
    offsetY,
    pageX,
    pageY,
    region,
    relatedTraget,
    screenX,
    screenY,
    shiftKey,
    x,
    y}
}

function getTouchTargets(targets) {
  targets = Array.from(targets)

  return targets.map((el) => {
    // el = Object.assign({}, el)
    let {clientX, clientY, force, identifier, pageX, pageY,
        radiusX, radiusY, rotationAngle, screenX, screenY,
        target} = el

    if(target && target.nodeType === 1) {
      target = target.dataset.isctId
    }

    return {clientX,
      clientY,
      force,
      identifier,
      pageX,
      pageY,
      radiusX,
      radiusY,
      rotationAngle,
      screenX,
      screenY,
      target}
  })
}

export function getTouchEventArgs(evt) {
  // https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent
  let {touches, targetTouches, changedTouches,
    ctrlKey, shiftKey, altKey, metaKey} = evt

  if(touches) {
    touches = getTouchTargets(touches)
  }
  if(targetTouches) {
    targetTouches = getTouchTargets(targetTouches)
  }
  if(changedTouches) {
    changedTouches = getTouchTargets(changedTouches)
  }
  return {touches,
    targetTouches,
    changedTouches,
    ctrlKey,
    shiftKey,
    altKey,
    metaKey}
}
