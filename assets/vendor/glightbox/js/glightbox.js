(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
      ? define(factory)
      : (global = global || self, global.GLightbox = factory())
}(this, function () {
  'use strict'

  function _typeof (obj) {
    '@babel/helpers - typeof'

    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
      _typeof = function (obj) {
        return typeof obj
      }
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
      }
    }

    return _typeof(obj)
  }

  function _classCallCheck (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function')
    }
  }

  function _defineProperties (target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }

  function _createClass (Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps)
    if (staticProps) _defineProperties(Constructor, staticProps)
    return Constructor
  }

  const uid = Date.now()
  function extend () {
    const extended = {}
    let deep = true
    let i = 0
    const length = arguments.length

    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
      deep = arguments[0]
      i++
    }

    const merge = function merge (obj) {
      for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            extended[prop] = extend(true, extended[prop], obj[prop])
          } else {
            extended[prop] = obj[prop]
          }
        }
      }
    }

    for (; i < length; i++) {
      const obj = arguments[i]
      merge(obj)
    }

    return extended
  }
  function each (collection, callback) {
    if (isNode(collection) || collection === window || collection === document) {
      collection = [collection]
    }

    if (!isArrayLike(collection) && !isObject(collection)) {
      collection = [collection]
    }

    if (size(collection) == 0) {
      return
    }

    if (isArrayLike(collection) && !isObject(collection)) {
      const l = collection.length
      let i = 0

      for (; i < l; i++) {
        if (callback.call(collection[i], collection[i], i, collection) === false) {
          break
        }
      }
    } else if (isObject(collection)) {
      for (const key in collection) {
        if (has(collection, key)) {
          if (callback.call(collection[key], collection[key], key, collection) === false) {
            break
          }
        }
      }
    }
  }
  function getNodeEvents (node) {
    const name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
    const fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null
    const cache = node[uid] = node[uid] || []
    const data = {
      all: cache,
      evt: null,
      found: null
    }

    if (name && fn && size(cache) > 0) {
      each(cache, function (cl, i) {
        if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
          data.found = true
          data.evt = i
          return false
        }
      })
    }

    return data
  }
  function addEvent (eventName) {
    const _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
    const onElement = _ref.onElement
    const withCallback = _ref.withCallback
    const _ref$avoidDuplicate = _ref.avoidDuplicate
    const avoidDuplicate = _ref$avoidDuplicate === void 0 ? true : _ref$avoidDuplicate
    const _ref$once = _ref.once
    const once = _ref$once === void 0 ? false : _ref$once
    const _ref$useCapture = _ref.useCapture
    const useCapture = _ref$useCapture === void 0 ? false : _ref$useCapture

    const thisArg = arguments.length > 2 ? arguments[2] : undefined
    let element = onElement || []

    if (isString(element)) {
      element = document.querySelectorAll(element)
    }

    function handler (event) {
      if (isFunction(withCallback)) {
        withCallback.call(thisArg, event, this)
      }

      if (once) {
        handler.destroy()
      }
    }

    handler.destroy = function () {
      each(element, function (el) {
        const events = getNodeEvents(el, eventName, handler)

        if (events.found) {
          events.all.splice(events.evt, 1)
        }

        if (el.removeEventListener) {
          el.removeEventListener(eventName, handler, useCapture)
        }
      })
    }

    each(element, function (el) {
      const events = getNodeEvents(el, eventName, handler)

      if (el.addEventListener && avoidDuplicate && !events.found || !avoidDuplicate) {
        el.addEventListener(eventName, handler, useCapture)
        events.all.push({
          eventName,
          fn: handler
        })
      }
    })
    return handler
  }
  function addClass (node, name) {
    each(name.split(' '), function (cl) {
      return node.classList.add(cl)
    })
  }
  function removeClass (node, name) {
    each(name.split(' '), function (cl) {
      return node.classList.remove(cl)
    })
  }
  function hasClass (node, name) {
    return node.classList.contains(name)
  }
  function closest (elem, selector) {
    while (elem !== document.body) {
      elem = elem.parentElement

      if (!elem) {
        return false
      }

      const matches = typeof elem.matches === 'function' ? elem.matches(selector) : elem.msMatchesSelector(selector)

      if (matches) {
        return elem
      }
    }
  }
  function animateElement (element) {
    const animation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ''
    const callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false

    if (!element || animation === '') {
      return false
    }

    if (animation === 'none') {
      if (isFunction(callback)) {
        callback()
      }

      return false
    }

    const animationEnd = whichAnimationEvent()
    const animationNames = animation.split(' ')
    each(animationNames, function (name) {
      addClass(element, 'g' + name)
    })
    addEvent(animationEnd, {
      onElement: element,
      avoidDuplicate: false,
      once: true,
      withCallback: function withCallback (event, target) {
        each(animationNames, function (name) {
          removeClass(target, 'g' + name)
        })

        if (isFunction(callback)) {
          callback()
        }
      }
    })
  }
  function cssTransform (node) {
    const translate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ''

    if (translate === '') {
      node.style.webkitTransform = ''
      node.style.MozTransform = ''
      node.style.msTransform = ''
      node.style.OTransform = ''
      node.style.transform = ''
      return false
    }

    node.style.webkitTransform = translate
    node.style.MozTransform = translate
    node.style.msTransform = translate
    node.style.OTransform = translate
    node.style.transform = translate
  }
  function show (element) {
    element.style.display = 'block'
  }
  function hide (element) {
    element.style.display = 'none'
  }
  function createHTML (htmlStr) {
    const frag = document.createDocumentFragment()
    const temp = document.createElement('div')
    temp.innerHTML = htmlStr

    while (temp.firstChild) {
      frag.appendChild(temp.firstChild)
    }

    return frag
  }
  function windowSize () {
    return {
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
  }
  function whichAnimationEvent () {
    let t
    const el = document.createElement('fakeelement')
    const animations = {
      animation: 'animationend',
      OAnimation: 'oAnimationEnd',
      MozAnimation: 'animationend',
      WebkitAnimation: 'webkitAnimationEnd'
    }

    for (t in animations) {
      if (el.style[t] !== undefined) {
        return animations[t]
      }
    }
  }
  function whichTransitionEvent () {
    let t
    const el = document.createElement('fakeelement')
    const transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    }

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t]
      }
    }
  }
  function createIframe (config) {
    const url = config.url
    const allow = config.allow
    const callback = config.callback
    const appendTo = config.appendTo
    const iframe = document.createElement('iframe')
    iframe.className = 'vimeo-video gvideo'
    iframe.src = url
    iframe.style.width = '100%'
    iframe.style.height = '100%'

    if (allow) {
      iframe.setAttribute('allow', allow)
    }

    iframe.onload = function () {
      iframe.onload = null
      addClass(iframe, 'node-ready')

      if (isFunction(callback)) {
        callback()
      }
    }

    if (appendTo) {
      appendTo.appendChild(iframe)
    }

    return iframe
  }
  function waitUntil (check, onComplete, delay, timeout) {
    if (check()) {
      onComplete()
      return
    }

    if (!delay) {
      delay = 100
    }

    let timeoutPointer
    var intervalPointer = setInterval(function () {
      if (!check()) {
        return
      }

      clearInterval(intervalPointer)

      if (timeoutPointer) {
        clearTimeout(timeoutPointer)
      }

      onComplete()
    }, delay)

    if (timeout) {
      timeoutPointer = setTimeout(function () {
        clearInterval(intervalPointer)
      }, timeout)
    }
  }
  function injectAssets (url, waitFor, callback) {
    if (isNil(url)) {
      console.error('Inject assets error')
      return
    }

    if (isFunction(waitFor)) {
      callback = waitFor
      waitFor = false
    }

    if (isString(waitFor) && waitFor in window) {
      if (isFunction(callback)) {
        callback()
      }

      return
    }

    let found

    if (url.indexOf('.css') !== -1) {
      found = document.querySelectorAll('link[href="' + url + '"]')

      if (found && found.length > 0) {
        if (isFunction(callback)) {
          callback()
        }

        return
      }

      const head = document.getElementsByTagName('head')[0]
      const headStyles = head.querySelectorAll('link[rel="stylesheet"]')
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = url
      link.media = 'all'

      if (headStyles) {
        head.insertBefore(link, headStyles[0])
      } else {
        head.appendChild(link)
      }

      if (isFunction(callback)) {
        callback()
      }

      return
    }

    found = document.querySelectorAll('script[src="' + url + '"]')

    if (found && found.length > 0) {
      if (isFunction(callback)) {
        if (isString(waitFor)) {
          waitUntil(function () {
            return typeof window[waitFor] !== 'undefined'
          }, function () {
            callback()
          })
          return false
        }

        callback()
      }

      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url

    script.onload = function () {
      if (isFunction(callback)) {
        if (isString(waitFor)) {
          waitUntil(function () {
            return typeof window[waitFor] !== 'undefined'
          }, function () {
            callback()
          })
          return false
        }

        callback()
      }
    }

    document.body.appendChild(script)
  }
  function isMobile () {
    return 'navigator' in window && window.navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i)
  }
  function isTouch () {
    return isMobile() !== null || document.createTouch !== undefined || 'ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints
  }
  function isFunction (f) {
    return typeof f === 'function'
  }
  function isString (s) {
    return typeof s === 'string'
  }
  function isNode (el) {
    return !!(el && el.nodeType && el.nodeType == 1)
  }
  function isArray (ar) {
    return Array.isArray(ar)
  }
  function isArrayLike (ar) {
    return ar && ar.length && isFinite(ar.length)
  }
  function isObject (o) {
    const type = _typeof(o)

    return type === 'object' && o != null && !isFunction(o) && !isArray(o)
  }
  function isNil (o) {
    return o == null
  }
  function has (obj, key) {
    return obj !== null && hasOwnProperty.call(obj, key)
  }
  function size (o) {
    if (isObject(o)) {
      if (o.keys) {
        return o.keys().length
      }

      let l = 0

      for (const k in o) {
        if (has(o, k)) {
          l++
        }
      }

      return l
    } else {
      return o.length
    }
  }
  function isNumber (n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  }

  function getNextFocusElement () {
    let current = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1
    const btns = document.querySelectorAll('.gbtn[data-taborder]:not(.disabled)')

    if (!btns.length) {
      return false
    }

    if (btns.length == 1) {
      return btns[0]
    }

    if (typeof current === 'string') {
      current = parseInt(current)
    }

    const orders = []
    each(btns, function (btn) {
      orders.push(btn.getAttribute('data-taborder'))
    })
    const highestOrder = Math.max.apply(Math, orders.map(function (order) {
      return parseInt(order)
    }))
    let newIndex = current < 0 ? 1 : current + 1

    if (newIndex > highestOrder) {
      newIndex = '1'
    }

    const nextOrders = orders.filter(function (el) {
      return el >= parseInt(newIndex)
    })
    const nextFocus = nextOrders.sort()[0]
    return document.querySelector('.gbtn[data-taborder="'.concat(nextFocus, '"]'))
  }

  function keyboardNavigation (instance) {
    if (instance.events.hasOwnProperty('keyboard')) {
      return false
    }

    instance.events.keyboard = addEvent('keydown', {
      onElement: window,
      withCallback: function withCallback (event, target) {
        event = event || window.event
        const key = event.keyCode

        if (key == 9) {
          const focusedButton = document.querySelector('.gbtn.focused')

          if (!focusedButton) {
            const activeElement = document.activeElement && document.activeElement.nodeName ? document.activeElement.nodeName.toLocaleLowerCase() : false

            if (activeElement == 'input' || activeElement == 'textarea' || activeElement == 'button') {
              return
            }
          }

          event.preventDefault()
          const btns = document.querySelectorAll('.gbtn[data-taborder]')

          if (!btns || btns.length <= 0) {
            return
          }

          if (!focusedButton) {
            const first = getNextFocusElement()

            if (first) {
              first.focus()
              addClass(first, 'focused')
            }

            return
          }

          const currentFocusOrder = focusedButton.getAttribute('data-taborder')
          const nextFocus = getNextFocusElement(currentFocusOrder)
          removeClass(focusedButton, 'focused')

          if (nextFocus) {
            nextFocus.focus()
            addClass(nextFocus, 'focused')
          }
        }

        if (key == 39) {
          instance.nextSlide()
        }

        if (key == 37) {
          instance.prevSlide()
        }

        if (key == 27) {
          instance.close()
        }
      }
    })
  }

  function getLen (v) {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }

  function dot (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y
  }

  function getAngle (v1, v2) {
    const mr = getLen(v1) * getLen(v2)

    if (mr === 0) {
      return 0
    }

    let r = dot(v1, v2) / mr

    if (r > 1) {
      r = 1
    }

    return Math.acos(r)
  }

  function cross (v1, v2) {
    return v1.x * v2.y - v2.x * v1.y
  }

  function getRotateAngle (v1, v2) {
    let angle = getAngle(v1, v2)

    if (cross(v1, v2) > 0) {
      angle *= -1
    }

    return angle * 180 / Math.PI
  }

  const EventsHandlerAdmin = (function () {
    function EventsHandlerAdmin (el) {
      _classCallCheck(this, EventsHandlerAdmin)

      this.handlers = []
      this.el = el
    }

    _createClass(EventsHandlerAdmin, [{
      key: 'add',
      value: function add (handler) {
        this.handlers.push(handler)
      }
    }, {
      key: 'del',
      value: function del (handler) {
        if (!handler) {
          this.handlers = []
        }

        for (let i = this.handlers.length; i >= 0; i--) {
          if (this.handlers[i] === handler) {
            this.handlers.splice(i, 1)
          }
        }
      }
    }, {
      key: 'dispatch',
      value: function dispatch () {
        for (let i = 0, len = this.handlers.length; i < len; i++) {
          const handler = this.handlers[i]

          if (typeof handler === 'function') {
            handler.apply(this.el, arguments)
          }
        }
      }
    }])

    return EventsHandlerAdmin
  }())

  function wrapFunc (el, handler) {
    const EventshandlerAdmin = new EventsHandlerAdmin(el)
    EventshandlerAdmin.add(handler)
    return EventshandlerAdmin
  }

  const TouchEvents = (function () {
    function TouchEvents (el, option) {
      _classCallCheck(this, TouchEvents)

      this.element = typeof el === 'string' ? document.querySelector(el) : el
      this.start = this.start.bind(this)
      this.move = this.move.bind(this)
      this.end = this.end.bind(this)
      this.cancel = this.cancel.bind(this)
      this.element.addEventListener('touchstart', this.start, false)
      this.element.addEventListener('touchmove', this.move, false)
      this.element.addEventListener('touchend', this.end, false)
      this.element.addEventListener('touchcancel', this.cancel, false)
      this.preV = {
        x: null,
        y: null
      }
      this.pinchStartLen = null
      this.zoom = 1
      this.isDoubleTap = false

      const noop = function noop () {}

      this.rotate = wrapFunc(this.element, option.rotate || noop)
      this.touchStart = wrapFunc(this.element, option.touchStart || noop)
      this.multipointStart = wrapFunc(this.element, option.multipointStart || noop)
      this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop)
      this.pinch = wrapFunc(this.element, option.pinch || noop)
      this.swipe = wrapFunc(this.element, option.swipe || noop)
      this.tap = wrapFunc(this.element, option.tap || noop)
      this.doubleTap = wrapFunc(this.element, option.doubleTap || noop)
      this.longTap = wrapFunc(this.element, option.longTap || noop)
      this.singleTap = wrapFunc(this.element, option.singleTap || noop)
      this.pressMove = wrapFunc(this.element, option.pressMove || noop)
      this.twoFingerPressMove = wrapFunc(this.element, option.twoFingerPressMove || noop)
      this.touchMove = wrapFunc(this.element, option.touchMove || noop)
      this.touchEnd = wrapFunc(this.element, option.touchEnd || noop)
      this.touchCancel = wrapFunc(this.element, option.touchCancel || noop)
      this.translateContainer = this.element
      this._cancelAllHandler = this.cancelAll.bind(this)
      window.addEventListener('scroll', this._cancelAllHandler)
      this.delta = null
      this.last = null
      this.now = null
      this.tapTimeout = null
      this.singleTapTimeout = null
      this.longTapTimeout = null
      this.swipeTimeout = null
      this.x1 = this.x2 = this.y1 = this.y2 = null
      this.preTapPosition = {
        x: null,
        y: null
      }
    }

    _createClass(TouchEvents, [{
      key: 'start',
      value: function start (evt) {
        if (!evt.touches) {
          return
        }

        const ignoreDragFor = ['a', 'button', 'input']

        if (evt.target && evt.target.nodeName && ignoreDragFor.indexOf(evt.target.nodeName.toLowerCase()) >= 0) {
          console.log('ignore drag for this touched element', evt.target.nodeName.toLowerCase())
          return
        }

        this.now = Date.now()
        this.x1 = evt.touches[0].pageX
        this.y1 = evt.touches[0].pageY
        this.delta = this.now - (this.last || this.now)
        this.touchStart.dispatch(evt, this.element)

        if (this.preTapPosition.x !== null) {
          this.isDoubleTap = this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30

          if (this.isDoubleTap) {
            clearTimeout(this.singleTapTimeout)
          }
        }

        this.preTapPosition.x = this.x1
        this.preTapPosition.y = this.y1
        this.last = this.now
        const preV = this.preV
        const len = evt.touches.length

        if (len > 1) {
          this._cancelLongTap()

          this._cancelSingleTap()

          const v = {
            x: evt.touches[1].pageX - this.x1,
            y: evt.touches[1].pageY - this.y1
          }
          preV.x = v.x
          preV.y = v.y
          this.pinchStartLen = getLen(preV)
          this.multipointStart.dispatch(evt, this.element)
        }

        this._preventTap = false
        this.longTapTimeout = setTimeout(function () {
          this.longTap.dispatch(evt, this.element)
          this._preventTap = true
        }.bind(this), 750)
      }
    }, {
      key: 'move',
      value: function move (evt) {
        if (!evt.touches) {
          return
        }

        const preV = this.preV
        const len = evt.touches.length
        const currentX = evt.touches[0].pageX
        const currentY = evt.touches[0].pageY
        this.isDoubleTap = false

        if (len > 1) {
          const sCurrentX = evt.touches[1].pageX
          const sCurrentY = evt.touches[1].pageY
          const v = {
            x: evt.touches[1].pageX - currentX,
            y: evt.touches[1].pageY - currentY
          }

          if (preV.x !== null) {
            if (this.pinchStartLen > 0) {
              evt.zoom = getLen(v) / this.pinchStartLen
              this.pinch.dispatch(evt, this.element)
            }

            evt.angle = getRotateAngle(v, preV)
            this.rotate.dispatch(evt, this.element)
          }

          preV.x = v.x
          preV.y = v.y

          if (this.x2 !== null && this.sx2 !== null) {
            evt.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2
            evt.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2
          } else {
            evt.deltaX = 0
            evt.deltaY = 0
          }

          this.twoFingerPressMove.dispatch(evt, this.element)
          this.sx2 = sCurrentX
          this.sy2 = sCurrentY
        } else {
          if (this.x2 !== null) {
            evt.deltaX = currentX - this.x2
            evt.deltaY = currentY - this.y2
            const movedX = Math.abs(this.x1 - this.x2)
            const movedY = Math.abs(this.y1 - this.y2)

            if (movedX > 10 || movedY > 10) {
              this._preventTap = true
            }
          } else {
            evt.deltaX = 0
            evt.deltaY = 0
          }

          this.pressMove.dispatch(evt, this.element)
        }

        this.touchMove.dispatch(evt, this.element)

        this._cancelLongTap()

        this.x2 = currentX
        this.y2 = currentY

        if (len > 1) {
          evt.preventDefault()
        }
      }
    }, {
      key: 'end',
      value: function end (evt) {
        if (!evt.changedTouches) {
          return
        }

        this._cancelLongTap()

        const self = this

        if (evt.touches.length < 2) {
          this.multipointEnd.dispatch(evt, this.element)
          this.sx2 = this.sy2 = null
        }

        if (this.x2 && Math.abs(this.x1 - this.x2) > 30 || this.y2 && Math.abs(this.y1 - this.y2) > 30) {
          evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2)
          this.swipeTimeout = setTimeout(function () {
            self.swipe.dispatch(evt, self.element)
          }, 0)
        } else {
          this.tapTimeout = setTimeout(function () {
            if (!self._preventTap) {
              self.tap.dispatch(evt, self.element)
            }

            if (self.isDoubleTap) {
              self.doubleTap.dispatch(evt, self.element)
              self.isDoubleTap = false
            }
          }, 0)

          if (!self.isDoubleTap) {
            self.singleTapTimeout = setTimeout(function () {
              self.singleTap.dispatch(evt, self.element)
            }, 250)
          }
        }

        this.touchEnd.dispatch(evt, this.element)
        this.preV.x = 0
        this.preV.y = 0
        this.zoom = 1
        this.pinchStartLen = null
        this.x1 = this.x2 = this.y1 = this.y2 = null
      }
    }, {
      key: 'cancelAll',
      value: function cancelAll () {
        this._preventTap = true
        clearTimeout(this.singleTapTimeout)
        clearTimeout(this.tapTimeout)
        clearTimeout(this.longTapTimeout)
        clearTimeout(this.swipeTimeout)
      }
    }, {
      key: 'cancel',
      value: function cancel (evt) {
        this.cancelAll()
        this.touchCancel.dispatch(evt, this.element)
      }
    }, {
      key: '_cancelLongTap',
      value: function _cancelLongTap () {
        clearTimeout(this.longTapTimeout)
      }
    }, {
      key: '_cancelSingleTap',
      value: function _cancelSingleTap () {
        clearTimeout(this.singleTapTimeout)
      }
    }, {
      key: '_swipeDirection',
      value: function _swipeDirection (x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down'
      }
    }, {
      key: 'on',
      value: function on (evt, handler) {
        if (this[evt]) {
          this[evt].add(handler)
        }
      }
    }, {
      key: 'off',
      value: function off (evt, handler) {
        if (this[evt]) {
          this[evt].del(handler)
        }
      }
    }, {
      key: 'destroy',
      value: function destroy () {
        if (this.singleTapTimeout) {
          clearTimeout(this.singleTapTimeout)
        }

        if (this.tapTimeout) {
          clearTimeout(this.tapTimeout)
        }

        if (this.longTapTimeout) {
          clearTimeout(this.longTapTimeout)
        }

        if (this.swipeTimeout) {
          clearTimeout(this.swipeTimeout)
        }

        this.element.removeEventListener('touchstart', this.start)
        this.element.removeEventListener('touchmove', this.move)
        this.element.removeEventListener('touchend', this.end)
        this.element.removeEventListener('touchcancel', this.cancel)
        this.rotate.del()
        this.touchStart.del()
        this.multipointStart.del()
        this.multipointEnd.del()
        this.pinch.del()
        this.swipe.del()
        this.tap.del()
        this.doubleTap.del()
        this.longTap.del()
        this.singleTap.del()
        this.pressMove.del()
        this.twoFingerPressMove.del()
        this.touchMove.del()
        this.touchEnd.del()
        this.touchCancel.del()
        this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null
        window.removeEventListener('scroll', this._cancelAllHandler)
        return null
      }
    }])

    return TouchEvents
  }())

  function resetSlideMove (slide) {
    const transitionEnd = whichTransitionEvent()
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let media = hasClass(slide, 'gslide-media') ? slide : slide.querySelector('.gslide-media')
    const container = closest(media, '.ginner-container')
    const desc = slide.querySelector('.gslide-description')

    if (windowWidth > 769) {
      media = container
    }

    addClass(media, 'greset')
    cssTransform(media, 'translate3d(0, 0, 0)')
    addEvent(transitionEnd, {
      onElement: media,
      once: true,
      withCallback: function withCallback (event, target) {
        removeClass(media, 'greset')
      }
    })
    media.style.opacity = ''

    if (desc) {
      desc.style.opacity = ''
    }
  }

  function touchNavigation (instance) {
    if (instance.events.hasOwnProperty('touch')) {
      return false
    }

    const winSize = windowSize()
    const winWidth = winSize.width
    const winHeight = winSize.height
    let process = false
    let currentSlide = null
    let media = null
    let mediaImage = null
    let doingMove = false
    let initScale = 1
    const maxScale = 4.5
    let currentScale = 1
    let doingZoom = false
    let imageZoomed = false
    let zoomedPosX = null
    let zoomedPosY = null
    let lastZoomedPosX = null
    let lastZoomedPosY = null
    let hDistance
    let vDistance
    let hDistancePercent = 0
    let vDistancePercent = 0
    let vSwipe = false
    let hSwipe = false
    const startCoords = {}
    let endCoords = {}
    let xDown = 0
    let yDown = 0
    let isInlined
    const sliderWrapper = document.getElementById('glightbox-slider')
    const overlay = document.querySelector('.goverlay')
    const touchInstance = new TouchEvents(sliderWrapper, {
      touchStart: function touchStart (e) {
        process = true

        if (hasClass(e.targetTouches[0].target, 'ginner-container') || closest(e.targetTouches[0].target, '.gslide-desc') || e.targetTouches[0].target.nodeName.toLowerCase() == 'a') {
          process = false
        }

        if (closest(e.targetTouches[0].target, '.gslide-inline') && !hasClass(e.targetTouches[0].target.parentNode, 'gslide-inline')) {
          process = false
        }

        if (process) {
          endCoords = e.targetTouches[0]
          startCoords.pageX = e.targetTouches[0].pageX
          startCoords.pageY = e.targetTouches[0].pageY
          xDown = e.targetTouches[0].clientX
          yDown = e.targetTouches[0].clientY
          currentSlide = instance.activeSlide
          media = currentSlide.querySelector('.gslide-media')
          isInlined = currentSlide.querySelector('.gslide-inline')
          mediaImage = null

          if (hasClass(media, 'gslide-image')) {
            mediaImage = media.querySelector('img')
          }

          const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth

          if (windowWidth > 769) {
            media = currentSlide.querySelector('.ginner-container')
          }

          removeClass(overlay, 'greset')

          if (e.pageX > 20 && e.pageX < window.innerWidth - 20) {
            return
          }

          e.preventDefault()
        }
      },
      touchMove: function touchMove (e) {
        if (!process) {
          return
        }

        endCoords = e.targetTouches[0]

        if (doingZoom || imageZoomed) {
          return
        }

        if (isInlined && isInlined.offsetHeight > winHeight) {
          const moved = startCoords.pageX - endCoords.pageX

          if (Math.abs(moved) <= 13) {
            return false
          }
        }

        doingMove = true
        const xUp = e.targetTouches[0].clientX
        const yUp = e.targetTouches[0].clientY
        const xDiff = xDown - xUp
        const yDiff = yDown - yUp

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          vSwipe = false
          hSwipe = true
        } else {
          hSwipe = false
          vSwipe = true
        }

        hDistance = endCoords.pageX - startCoords.pageX
        hDistancePercent = hDistance * 100 / winWidth
        vDistance = endCoords.pageY - startCoords.pageY
        vDistancePercent = vDistance * 100 / winHeight
        let opacity

        if (vSwipe && mediaImage) {
          opacity = 1 - Math.abs(vDistance) / winHeight
          overlay.style.opacity = opacity

          if (instance.settings.touchFollowAxis) {
            hDistancePercent = 0
          }
        }

        if (hSwipe) {
          opacity = 1 - Math.abs(hDistance) / winWidth
          media.style.opacity = opacity

          if (instance.settings.touchFollowAxis) {
            vDistancePercent = 0
          }
        }

        if (!mediaImage) {
          return cssTransform(media, 'translate3d('.concat(hDistancePercent, '%, 0, 0)'))
        }

        cssTransform(media, 'translate3d('.concat(hDistancePercent, '%, ').concat(vDistancePercent, '%, 0)'))
      },
      touchEnd: function touchEnd () {
        if (!process) {
          return
        }

        doingMove = false

        if (imageZoomed || doingZoom) {
          lastZoomedPosX = zoomedPosX
          lastZoomedPosY = zoomedPosY
          return
        }

        const v = Math.abs(parseInt(vDistancePercent))
        const h = Math.abs(parseInt(hDistancePercent))

        if (v > 29 && mediaImage) {
          instance.close()
          return
        }

        if (v < 29 && h < 25) {
          addClass(overlay, 'greset')
          overlay.style.opacity = 1
          return resetSlideMove(media)
        }
      },
      multipointEnd: function multipointEnd () {
        setTimeout(function () {
          doingZoom = false
        }, 50)
      },
      multipointStart: function multipointStart () {
        doingZoom = true
        initScale = currentScale || 1
      },
      pinch: function pinch (evt) {
        if (!mediaImage || doingMove) {
          return false
        }

        doingZoom = true
        mediaImage.scaleX = mediaImage.scaleY = initScale * evt.zoom
        let scale = initScale * evt.zoom
        imageZoomed = true

        if (scale <= 1) {
          imageZoomed = false
          scale = 1
          lastZoomedPosY = null
          lastZoomedPosX = null
          zoomedPosX = null
          zoomedPosY = null
          mediaImage.setAttribute('style', '')
          return
        }

        if (scale > maxScale) {
          scale = maxScale
        }

        mediaImage.style.transform = 'scale3d('.concat(scale, ', ').concat(scale, ', 1)')
        currentScale = scale
      },
      pressMove: function pressMove (e) {
        if (imageZoomed && !doingZoom) {
          let mhDistance = endCoords.pageX - startCoords.pageX
          let mvDistance = endCoords.pageY - startCoords.pageY

          if (lastZoomedPosX) {
            mhDistance = mhDistance + lastZoomedPosX
          }

          if (lastZoomedPosY) {
            mvDistance = mvDistance + lastZoomedPosY
          }

          zoomedPosX = mhDistance
          zoomedPosY = mvDistance
          let style = 'translate3d('.concat(mhDistance, 'px, ').concat(mvDistance, 'px, 0)')

          if (currentScale) {
            style += ' scale3d('.concat(currentScale, ', ').concat(currentScale, ', 1)')
          }

          cssTransform(mediaImage, style)
        }
      },
      swipe: function swipe (evt) {
        if (imageZoomed) {
          return
        }

        if (doingZoom) {
          doingZoom = false
          return
        }

        if (evt.direction == 'Left') {
          if (instance.index == instance.elements.length - 1) {
            return resetSlideMove(media)
          }

          instance.nextSlide()
        }

        if (evt.direction == 'Right') {
          if (instance.index == 0) {
            return resetSlideMove(media)
          }

          instance.prevSlide()
        }
      }
    })
    instance.events.touch = touchInstance
  }

  const ZoomImages = (function () {
    function ZoomImages (el, slide) {
      const _this = this

      const onclose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null

      _classCallCheck(this, ZoomImages)

      this.img = el
      this.slide = slide
      this.onclose = onclose

      if (this.img.setZoomEvents) {
        return false
      }

      this.active = false
      this.zoomedIn = false
      this.dragging = false
      this.currentX = null
      this.currentY = null
      this.initialX = null
      this.initialY = null
      this.xOffset = 0
      this.yOffset = 0
      this.img.addEventListener('mousedown', function (e) {
        return _this.dragStart(e)
      }, false)
      this.img.addEventListener('mouseup', function (e) {
        return _this.dragEnd(e)
      }, false)
      this.img.addEventListener('mousemove', function (e) {
        return _this.drag(e)
      }, false)
      this.img.addEventListener('click', function (e) {
        if (_this.slide.classList.contains('dragging-nav')) {
          _this.zoomOut()

          return false
        }

        if (!_this.zoomedIn) {
          return _this.zoomIn()
        }

        if (_this.zoomedIn && !_this.dragging) {
          _this.zoomOut()
        }
      }, false)
      this.img.setZoomEvents = true
    }

    _createClass(ZoomImages, [{
      key: 'zoomIn',
      value: function zoomIn () {
        const winWidth = this.widowWidth()

        if (this.zoomedIn || winWidth <= 768) {
          return
        }

        const img = this.img
        img.setAttribute('data-style', img.getAttribute('style'))
        img.style.maxWidth = img.naturalWidth + 'px'
        img.style.maxHeight = img.naturalHeight + 'px'

        if (img.naturalWidth > winWidth) {
          const centerX = winWidth / 2 - img.naturalWidth / 2
          this.setTranslate(this.img.parentNode, centerX, 0)
        }

        this.slide.classList.add('zoomed')
        this.zoomedIn = true
      }
    }, {
      key: 'zoomOut',
      value: function zoomOut () {
        this.img.parentNode.setAttribute('style', '')
        this.img.setAttribute('style', this.img.getAttribute('data-style'))
        this.slide.classList.remove('zoomed')
        this.zoomedIn = false
        this.currentX = null
        this.currentY = null
        this.initialX = null
        this.initialY = null
        this.xOffset = 0
        this.yOffset = 0

        if (this.onclose && typeof this.onclose === 'function') {
          this.onclose()
        }
      }
    }, {
      key: 'dragStart',
      value: function dragStart (e) {
        e.preventDefault()

        if (!this.zoomedIn) {
          this.active = false
          return
        }

        if (e.type === 'touchstart') {
          this.initialX = e.touches[0].clientX - this.xOffset
          this.initialY = e.touches[0].clientY - this.yOffset
        } else {
          this.initialX = e.clientX - this.xOffset
          this.initialY = e.clientY - this.yOffset
        }

        if (e.target === this.img) {
          this.active = true
          this.img.classList.add('dragging')
        }
      }
    }, {
      key: 'dragEnd',
      value: function dragEnd (e) {
        const _this2 = this

        e.preventDefault()
        this.initialX = this.currentX
        this.initialY = this.currentY
        this.active = false
        setTimeout(function () {
          _this2.dragging = false
          _this2.img.isDragging = false

          _this2.img.classList.remove('dragging')
        }, 100)
      }
    }, {
      key: 'drag',
      value: function drag (e) {
        if (this.active) {
          e.preventDefault()

          if (e.type === 'touchmove') {
            this.currentX = e.touches[0].clientX - this.initialX
            this.currentY = e.touches[0].clientY - this.initialY
          } else {
            this.currentX = e.clientX - this.initialX
            this.currentY = e.clientY - this.initialY
          }

          this.xOffset = this.currentX
          this.yOffset = this.currentY
          this.img.isDragging = true
          this.dragging = true
          this.setTranslate(this.img, this.currentX, this.currentY)
        }
      }
    }, {
      key: 'onMove',
      value: function onMove (e) {
        if (!this.zoomedIn) {
          return
        }

        const xOffset = e.clientX - this.img.naturalWidth / 2
        const yOffset = e.clientY - this.img.naturalHeight / 2
        this.setTranslate(this.img, xOffset, yOffset)
      }
    }, {
      key: 'setTranslate',
      value: function setTranslate (node, xPos, yPos) {
        node.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)'
      }
    }, {
      key: 'widowWidth',
      value: function widowWidth () {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      }
    }])

    return ZoomImages
  }())

  const DragSlides = (function () {
    function DragSlides () {
      const _this = this

      const config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

      _classCallCheck(this, DragSlides)

      const dragEl = config.dragEl
      const _config$toleranceX = config.toleranceX
      const toleranceX = _config$toleranceX === void 0 ? 40 : _config$toleranceX
      const _config$toleranceY = config.toleranceY
      const toleranceY = _config$toleranceY === void 0 ? 65 : _config$toleranceY
      const _config$slide = config.slide
      const slide = _config$slide === void 0 ? null : _config$slide
      const _config$instance = config.instance
      const instance = _config$instance === void 0 ? null : _config$instance
      this.el = dragEl
      this.active = false
      this.dragging = false
      this.currentX = null
      this.currentY = null
      this.initialX = null
      this.initialY = null
      this.xOffset = 0
      this.yOffset = 0
      this.direction = null
      this.lastDirection = null
      this.toleranceX = toleranceX
      this.toleranceY = toleranceY
      this.toleranceReached = false
      this.dragContainer = this.el
      this.slide = slide
      this.instance = instance
      this.el.addEventListener('mousedown', function (e) {
        return _this.dragStart(e)
      }, false)
      this.el.addEventListener('mouseup', function (e) {
        return _this.dragEnd(e)
      }, false)
      this.el.addEventListener('mousemove', function (e) {
        return _this.drag(e)
      }, false)
    }

    _createClass(DragSlides, [{
      key: 'dragStart',
      value: function dragStart (e) {
        if (this.slide.classList.contains('zoomed')) {
          this.active = false
          return
        }

        if (e.type === 'touchstart') {
          this.initialX = e.touches[0].clientX - this.xOffset
          this.initialY = e.touches[0].clientY - this.yOffset
        } else {
          this.initialX = e.clientX - this.xOffset
          this.initialY = e.clientY - this.yOffset
        }

        const clicked = e.target.nodeName.toLowerCase()
        const exludeClicks = ['input', 'select', 'textarea', 'button', 'a']

        if (e.target.classList.contains('nodrag') || closest(e.target, '.nodrag') || exludeClicks.indexOf(clicked) !== -1) {
          this.active = false
          return
        }

        e.preventDefault()

        if (e.target === this.el || clicked !== 'img' && closest(e.target, '.gslide-inline')) {
          this.active = true
          this.el.classList.add('dragging')
          this.dragContainer = closest(e.target, '.ginner-container')
        }
      }
    }, {
      key: 'dragEnd',
      value: function dragEnd (e) {
        const _this2 = this

        e && e.preventDefault()
        this.initialX = 0
        this.initialY = 0
        this.currentX = null
        this.currentY = null
        this.initialX = null
        this.initialY = null
        this.xOffset = 0
        this.yOffset = 0
        this.active = false

        if (this.doSlideChange) {
          this.instance.preventOutsideClick = true
          this.doSlideChange == 'right' && this.instance.prevSlide()
          this.doSlideChange == 'left' && this.instance.nextSlide()
        }

        if (this.doSlideClose) {
          this.instance.close()
        }

        if (!this.toleranceReached) {
          this.setTranslate(this.dragContainer, 0, 0, true)
        }

        setTimeout(function () {
          _this2.instance.preventOutsideClick = false
          _this2.toleranceReached = false
          _this2.lastDirection = null
          _this2.dragging = false
          _this2.el.isDragging = false

          _this2.el.classList.remove('dragging')

          _this2.slide.classList.remove('dragging-nav')

          _this2.dragContainer.style.transform = ''
          _this2.dragContainer.style.transition = ''
        }, 100)
      }
    }, {
      key: 'drag',
      value: function drag (e) {
        if (this.active) {
          e.preventDefault()
          this.slide.classList.add('dragging-nav')

          if (e.type === 'touchmove') {
            this.currentX = e.touches[0].clientX - this.initialX
            this.currentY = e.touches[0].clientY - this.initialY
          } else {
            this.currentX = e.clientX - this.initialX
            this.currentY = e.clientY - this.initialY
          }

          this.xOffset = this.currentX
          this.yOffset = this.currentY
          this.el.isDragging = true
          this.dragging = true
          this.doSlideChange = false
          this.doSlideClose = false
          const currentXInt = Math.abs(this.currentX)
          const currentYInt = Math.abs(this.currentY)

          if (currentXInt > 0 && currentXInt >= Math.abs(this.currentY) && (!this.lastDirection || this.lastDirection == 'x')) {
            this.yOffset = 0
            this.lastDirection = 'x'
            this.setTranslate(this.dragContainer, this.currentX, 0)
            const doChange = this.shouldChange()

            if (!this.instance.settings.dragAutoSnap && doChange) {
              this.doSlideChange = doChange
            }

            if (this.instance.settings.dragAutoSnap && doChange) {
              this.instance.preventOutsideClick = true
              this.toleranceReached = true
              this.active = false
              this.instance.preventOutsideClick = true
              this.dragEnd(null)
              doChange == 'right' && this.instance.prevSlide()
              doChange == 'left' && this.instance.nextSlide()
              return
            }
          }

          if (this.toleranceY > 0 && currentYInt > 0 && currentYInt >= currentXInt && (!this.lastDirection || this.lastDirection == 'y')) {
            this.xOffset = 0
            this.lastDirection = 'y'
            this.setTranslate(this.dragContainer, 0, this.currentY)
            const doClose = this.shouldClose()

            if (!this.instance.settings.dragAutoSnap && doClose) {
              this.doSlideClose = true
            }

            if (this.instance.settings.dragAutoSnap && doClose) {
              this.instance.close()
            }
          }
        }
      }
    }, {
      key: 'shouldChange',
      value: function shouldChange () {
        let doChange = false
        const currentXInt = Math.abs(this.currentX)

        if (currentXInt >= this.toleranceX) {
          const dragDir = this.currentX > 0 ? 'right' : 'left'

          if (dragDir == 'left' && this.slide !== this.slide.parentNode.lastChild || dragDir == 'right' && this.slide !== this.slide.parentNode.firstChild) {
            doChange = dragDir
          }
        }

        return doChange
      }
    }, {
      key: 'shouldClose',
      value: function shouldClose () {
        let doClose = false
        const currentYInt = Math.abs(this.currentY)

        if (currentYInt >= this.toleranceY) {
          doClose = true
        }

        return doClose
      }
    }, {
      key: 'setTranslate',
      value: function setTranslate (node, xPos, yPos) {
        const animated = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false

        if (animated) {
          node.style.transition = 'all .2s ease'
        } else {
          node.style.transition = ''
        }

        node.style.transform = 'translate3d('.concat(xPos, 'px, ').concat(yPos, 'px, 0)')
      }
    }])

    return DragSlides
  }())

  function slideImage (slide, data, index, callback) {
    const slideMedia = slide.querySelector('.gslide-media')
    const img = new Image()
    const titleID = 'gSlideTitle_' + index
    const textID = 'gSlideDesc_' + index
    img.addEventListener('load', function () {
      if (isFunction(callback)) {
        callback()
      }
    }, false)
    img.src = data.href

    if (data.sizes != '' && data.srcset != '') {
      img.sizes = data.sizes
      img.srcset = data.srcset
    }

    img.alt = ''

    if (!isNil(data.alt) && data.alt !== '') {
      img.alt = data.alt
    }

    if (data.title !== '') {
      img.setAttribute('aria-labelledby', titleID)
    }

    if (data.description !== '') {
      img.setAttribute('aria-describedby', textID)
    }

    if (data.hasOwnProperty('_hasCustomWidth') && data._hasCustomWidth) {
      img.style.width = data.width
    }

    if (data.hasOwnProperty('_hasCustomHeight') && data._hasCustomHeight) {
      img.style.height = data.height
    }

    slideMedia.insertBefore(img, slideMedia.firstChild)
  }

  function slideVideo (slide, data, index, callback) {
    const _this = this

    const slideContainer = slide.querySelector('.ginner-container')
    const videoID = 'gvideo' + index
    const slideMedia = slide.querySelector('.gslide-media')
    const videoPlayers = this.getAllPlayers()
    addClass(slideContainer, 'gvideo-container')
    slideMedia.insertBefore(createHTML('<div class="gvideo-wrapper"></div>'), slideMedia.firstChild)
    const videoWrapper = slide.querySelector('.gvideo-wrapper')
    injectAssets(this.settings.plyr.css, 'Plyr')
    const url = data.href
    let provider = data === null || data === void 0 ? void 0 : data.videoProvider
    let customPlaceholder = false
    slideMedia.style.maxWidth = data.width
    injectAssets(this.settings.plyr.js, 'Plyr', function () {
      if (!provider && url.match(/vimeo\.com\/([0-9]*)/)) {
        provider = 'vimeo'
      }

      if (!provider && (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/))) {
        provider = 'youtube'
      }

      if (provider === 'local' || !provider) {
        provider = 'local'
        let html = '<video id="' + videoID + '" '
        html += 'style="background:#000; max-width: '.concat(data.width, ';" ')
        html += 'preload="metadata" '
        html += 'x-webkit-airplay="allow" '
        html += 'playsinline '
        html += 'controls '
        html += 'class="gvideo-local">'
        html += '<source src="'.concat(url, '">')
        html += '</video>'
        customPlaceholder = createHTML(html)
      }

      const placeholder = customPlaceholder || createHTML('<div id="'.concat(videoID, '" data-plyr-provider="').concat(provider, '" data-plyr-embed-id="').concat(url, '"></div>'))
      addClass(videoWrapper, ''.concat(provider, '-video gvideo'))
      videoWrapper.appendChild(placeholder)
      videoWrapper.setAttribute('data-id', videoID)
      videoWrapper.setAttribute('data-index', index)
      const playerConfig = has(_this.settings.plyr, 'config') ? _this.settings.plyr.config : {}
      const player = new Plyr('#' + videoID, playerConfig)
      player.on('ready', function (event) {
        videoPlayers[videoID] = event.detail.plyr

        if (isFunction(callback)) {
          callback()
        }
      })
      waitUntil(function () {
        return slide.querySelector('iframe') && slide.querySelector('iframe').dataset.ready == 'true'
      }, function () {
        _this.resize(slide)
      })
      player.on('enterfullscreen', handleMediaFullScreen)
      player.on('exitfullscreen', handleMediaFullScreen)
    })
  }

  function handleMediaFullScreen (event) {
    const media = closest(event.target, '.gslide-media')

    if (event.type === 'enterfullscreen') {
      addClass(media, 'fullscreen')
    }

    if (event.type === 'exitfullscreen') {
      removeClass(media, 'fullscreen')
    }
  }

  function slideInline (slide, data, index, callback) {
    const _this = this

    const slideMedia = slide.querySelector('.gslide-media')
    const hash = has(data, 'href') && data.href ? data.href.split('#').pop().trim() : false
    const content = has(data, 'content') && data.content ? data.content : false
    let innerContent

    if (content) {
      if (isString(content)) {
        innerContent = createHTML('<div class="ginlined-content">'.concat(content, '</div>'))
      }

      if (isNode(content)) {
        if (content.style.display == 'none') {
          content.style.display = 'block'
        }

        const container = document.createElement('div')
        container.className = 'ginlined-content'
        container.appendChild(content)
        innerContent = container
      }
    }

    if (hash) {
      const div = document.getElementById(hash)

      if (!div) {
        return false
      }

      const cloned = div.cloneNode(true)
      cloned.style.height = data.height
      cloned.style.maxWidth = data.width
      addClass(cloned, 'ginlined-content')
      innerContent = cloned
    }

    if (!innerContent) {
      console.error('Unable to append inline slide content', data)
      return false
    }

    slideMedia.style.height = data.height
    slideMedia.style.width = data.width
    slideMedia.appendChild(innerContent)
    this.events['inlineclose' + hash] = addEvent('click', {
      onElement: slideMedia.querySelectorAll('.gtrigger-close'),
      withCallback: function withCallback (e) {
        e.preventDefault()

        _this.close()
      }
    })

    if (isFunction(callback)) {
      callback()
    }
  }

  function slideIframe (slide, data, index, callback) {
    const slideMedia = slide.querySelector('.gslide-media')
    const iframe = createIframe({
      url: data.href,
      callback
    })
    slideMedia.parentNode.style.maxWidth = data.width
    slideMedia.parentNode.style.height = data.height
    slideMedia.appendChild(iframe)
  }

  const SlideConfigParser = (function () {
    function SlideConfigParser () {
      const slideParamas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

      _classCallCheck(this, SlideConfigParser)

      this.defaults = {
        href: '',
        sizes: '',
        srcset: '',
        title: '',
        type: '',
        videoProvider: '',
        description: '',
        alt: '',
        descPosition: 'bottom',
        effect: '',
        width: '',
        height: '',
        content: false,
        zoomable: true,
        draggable: true
      }

      if (isObject(slideParamas)) {
        this.defaults = extend(this.defaults, slideParamas)
      }
    }

    _createClass(SlideConfigParser, [{
      key: 'sourceType',
      value: function sourceType (url) {
        const origin = url
        url = url.toLowerCase()

        if (url.match(/\.(jpeg|jpg|jpe|gif|png|apn|webp|avif|svg)/) !== null) {
          return 'image'
        }

        if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) {
          return 'video'
        }

        if (url.match(/vimeo\.com\/([0-9]*)/)) {
          return 'video'
        }

        if (url.match(/\.(mp4|ogg|webm|mov)/) !== null) {
          return 'video'
        }

        if (url.match(/\.(mp3|wav|wma|aac|ogg)/) !== null) {
          return 'audio'
        }

        if (url.indexOf('#') > -1) {
          const hash = origin.split('#').pop()

          if (hash.trim() !== '') {
            return 'inline'
          }
        }

        if (url.indexOf('goajax=true') > -1) {
          return 'ajax'
        }

        return 'external'
      }
    }, {
      key: 'parseConfig',
      value: function parseConfig (element, settings) {
        const _this = this

        const data = extend({
          descPosition: settings.descPosition
        }, this.defaults)

        if (isObject(element) && !isNode(element)) {
          if (!has(element, 'type')) {
            if (has(element, 'content') && element.content) {
              element.type = 'inline'
            } else if (has(element, 'href')) {
              element.type = this.sourceType(element.href)
            }
          }

          const objectData = extend(data, element)
          this.setSize(objectData, settings)
          return objectData
        }

        let url = ''
        const config = element.getAttribute('data-glightbox')
        const nodeType = element.nodeName.toLowerCase()

        if (nodeType === 'a') {
          url = element.href
        }

        if (nodeType === 'img') {
          url = element.src
          data.alt = element.alt
        }

        data.href = url
        each(data, function (val, key) {
          if (has(settings, key) && key !== 'width') {
            data[key] = settings[key]
          }

          const nodeData = element.dataset[key]

          if (!isNil(nodeData)) {
            data[key] = _this.sanitizeValue(nodeData)
          }
        })

        if (data.content) {
          data.type = 'inline'
        }

        if (!data.type && url) {
          data.type = this.sourceType(url)
        }

        if (!isNil(config)) {
          let cleanKeys = []
          each(data, function (v, k) {
            cleanKeys.push(';\\s?' + k)
          })
          cleanKeys = cleanKeys.join('\\s?:|')

          if (config.trim() !== '') {
            each(data, function (val, key) {
              const str = config
              const match = 's?' + key + 's?:s?(.*?)(' + cleanKeys + 's?:|$)'
              const regex = new RegExp(match)
              const matches = str.match(regex)

              if (matches && matches.length && matches[1]) {
                const value = matches[1].trim().replace(/;\s*$/, '')
                data[key] = _this.sanitizeValue(value)
              }
            })
          }
        } else {
          if (!data.title && nodeType == 'a') {
            const title = element.title

            if (!isNil(title) && title !== '') {
              data.title = title
            }
          }

          if (!data.title && nodeType == 'img') {
            const alt = element.alt

            if (!isNil(alt) && alt !== '') {
              data.title = alt
            }
          }
        }

        if (data.description && data.description.substring(0, 1) === '.') {
          let description

          try {
            description = document.querySelector(data.description).innerHTML
          } catch (error) {
            if (!(error instanceof DOMException)) {
              throw error
            }
          }

          if (description) {
            data.description = description
          }
        }

        if (!data.description) {
          const nodeDesc = element.querySelector('.glightbox-desc')

          if (nodeDesc) {
            data.description = nodeDesc.innerHTML
          }
        }

        this.setSize(data, settings, element)
        this.slideConfig = data
        return data
      }
    }, {
      key: 'setSize',
      value: function setSize (data, settings) {
        const element = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null
        const defaultWith = data.type == 'video' ? this.checkSize(settings.videosWidth) : this.checkSize(settings.width)
        const defaultHeight = this.checkSize(settings.height)
        data.width = has(data, 'width') && data.width !== '' ? this.checkSize(data.width) : defaultWith
        data.height = has(data, 'height') && data.height !== '' ? this.checkSize(data.height) : defaultHeight

        if (element && data.type == 'image') {
          data._hasCustomWidth = !!element.dataset.width
          data._hasCustomHeight = !!element.dataset.height
        }

        return data
      }
    }, {
      key: 'checkSize',
      value: function checkSize (size) {
        return isNumber(size) ? ''.concat(size, 'px') : size
      }
    }, {
      key: 'sanitizeValue',
      value: function sanitizeValue (val) {
        if (val !== 'true' && val !== 'false') {
          return val
        }

        return val === 'true'
      }
    }])

    return SlideConfigParser
  }())

  const Slide = (function () {
    function Slide (el, instance, index) {
      _classCallCheck(this, Slide)

      this.element = el
      this.instance = instance
      this.index = index
    }

    _createClass(Slide, [{
      key: 'setContent',
      value: function setContent () {
        const _this = this

        const slide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
        const callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false

        if (hasClass(slide, 'loaded')) {
          return false
        }

        const settings = this.instance.settings
        const slideConfig = this.slideConfig
        const isMobileDevice = isMobile()

        if (isFunction(settings.beforeSlideLoad)) {
          settings.beforeSlideLoad({
            index: this.index,
            slide,
            player: false
          })
        }

        const type = slideConfig.type
        const position = slideConfig.descPosition
        const slideMedia = slide.querySelector('.gslide-media')
        const slideTitle = slide.querySelector('.gslide-title')
        const slideText = slide.querySelector('.gslide-desc')
        const slideDesc = slide.querySelector('.gdesc-inner')
        let finalCallback = callback
        const titleID = 'gSlideTitle_' + this.index
        const textID = 'gSlideDesc_' + this.index

        if (isFunction(settings.afterSlideLoad)) {
          finalCallback = function finalCallback () {
            if (isFunction(callback)) {
              callback()
            }

            settings.afterSlideLoad({
              index: _this.index,
              slide,
              player: _this.instance.getSlidePlayerInstance(_this.index)
            })
          }
        }

        if (slideConfig.title == '' && slideConfig.description == '') {
          if (slideDesc) {
            slideDesc.parentNode.parentNode.removeChild(slideDesc.parentNode)
          }
        } else {
          if (slideTitle && slideConfig.title !== '') {
            slideTitle.id = titleID
            slideTitle.innerHTML = slideConfig.title
          } else {
            slideTitle.parentNode.removeChild(slideTitle)
          }

          if (slideText && slideConfig.description !== '') {
            slideText.id = textID

            if (isMobileDevice && settings.moreLength > 0) {
              slideConfig.smallDescription = this.slideShortDesc(slideConfig.description, settings.moreLength, settings.moreText)
              slideText.innerHTML = slideConfig.smallDescription
              this.descriptionEvents(slideText, slideConfig)
            } else {
              slideText.innerHTML = slideConfig.description
            }
          } else {
            slideText.parentNode.removeChild(slideText)
          }

          addClass(slideMedia.parentNode, 'desc-'.concat(position))
          addClass(slideDesc.parentNode, 'description-'.concat(position))
        }

        addClass(slideMedia, 'gslide-'.concat(type))
        addClass(slide, 'loaded')

        if (type === 'video') {
          slideVideo.apply(this.instance, [slide, slideConfig, this.index, finalCallback])
          return
        }

        if (type === 'external') {
          slideIframe.apply(this, [slide, slideConfig, this.index, finalCallback])
          return
        }

        if (type === 'inline') {
          slideInline.apply(this.instance, [slide, slideConfig, this.index, finalCallback])

          if (slideConfig.draggable) {
            new DragSlides({
              dragEl: slide.querySelector('.gslide-inline'),
              toleranceX: settings.dragToleranceX,
              toleranceY: settings.dragToleranceY,
              slide,
              instance: this.instance
            })
          }

          return
        }

        if (type === 'image') {
          slideImage(slide, slideConfig, this.index, function () {
            const img = slide.querySelector('img')

            if (slideConfig.draggable) {
              new DragSlides({
                dragEl: img,
                toleranceX: settings.dragToleranceX,
                toleranceY: settings.dragToleranceY,
                slide,
                instance: _this.instance
              })
            }

            if (slideConfig.zoomable && img.naturalWidth > img.offsetWidth) {
              addClass(img, 'zoomable')
              new ZoomImages(img, slide, function () {
                _this.instance.resize()
              })
            }

            if (isFunction(finalCallback)) {
              finalCallback()
            }
          })
          return
        }

        if (isFunction(finalCallback)) {
          finalCallback()
        }
      }
    }, {
      key: 'slideShortDesc',
      value: function slideShortDesc (string) {
        const n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50
        const wordBoundary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false
        let div = document.createElement('div')
        div.innerHTML = string
        const cleanedString = div.innerText
        const useWordBoundary = wordBoundary
        string = cleanedString.trim()

        if (string.length <= n) {
          return string
        }

        const subString = string.substr(0, n - 1)

        if (!useWordBoundary) {
          return subString
        }

        div = null
        return subString + '... <a href="#" class="desc-more">' + wordBoundary + '</a>'
      }
    }, {
      key: 'descriptionEvents',
      value: function descriptionEvents (desc, data) {
        const _this2 = this

        const moreLink = desc.querySelector('.desc-more')

        if (!moreLink) {
          return false
        }

        addEvent('click', {
          onElement: moreLink,
          withCallback: function withCallback (event, target) {
            event.preventDefault()
            const body = document.body
            const desc = closest(target, '.gslide-desc')

            if (!desc) {
              return false
            }

            desc.innerHTML = data.description
            addClass(body, 'gdesc-open')
            var shortEvent = addEvent('click', {
              onElement: [body, closest(desc, '.gslide-description')],
              withCallback: function withCallback (event, target) {
                if (event.target.nodeName.toLowerCase() !== 'a') {
                  removeClass(body, 'gdesc-open')
                  addClass(body, 'gdesc-closed')
                  desc.innerHTML = data.smallDescription

                  _this2.descriptionEvents(desc, data)

                  setTimeout(function () {
                    removeClass(body, 'gdesc-closed')
                  }, 400)
                  shortEvent.destroy()
                }
              }
            })
          }
        })
      }
    }, {
      key: 'create',
      value: function create () {
        return createHTML(this.instance.settings.slideHTML)
      }
    }, {
      key: 'getConfig',
      value: function getConfig () {
        if (!isNode(this.element) && !this.element.hasOwnProperty('draggable')) {
          this.element.draggable = this.instance.settings.draggable
        }

        const parser = new SlideConfigParser(this.instance.settings.slideExtraAttributes)
        this.slideConfig = parser.parseConfig(this.element, this.instance.settings)
        return this.slideConfig
      }
    }])

    return Slide
  }())

  const _version = '3.1.0'

  const isMobile$1 = isMobile()

  const isTouch$1 = isTouch()

  const html = document.getElementsByTagName('html')[0]
  const defaults = {
    selector: '.glightbox',
    elements: null,
    skin: 'clean',
    theme: 'clean',
    closeButton: true,
    startAt: null,
    autoplayVideos: true,
    autofocusVideos: true,
    descPosition: 'bottom',
    width: '900px',
    height: '506px',
    videosWidth: '960px',
    beforeSlideChange: null,
    afterSlideChange: null,
    beforeSlideLoad: null,
    afterSlideLoad: null,
    slideInserted: null,
    slideRemoved: null,
    slideExtraAttributes: null,
    onOpen: null,
    onClose: null,
    loop: false,
    zoomable: true,
    draggable: true,
    dragAutoSnap: false,
    dragToleranceX: 40,
    dragToleranceY: 65,
    preload: true,
    oneSlidePerOpen: false,
    touchNavigation: true,
    touchFollowAxis: true,
    keyboardNavigation: true,
    closeOnOutsideClick: true,
    plugins: false,
    plyr: {
      css: 'https://cdn.plyr.io/3.6.12/plyr.css',
      js: 'https://cdn.plyr.io/3.6.12/plyr.js',
      config: {
        ratio: '16:9',
        fullscreen: {
          enabled: true,
          iosNative: true
        },
        youtube: {
          noCookie: true,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3
        },
        vimeo: {
          byline: false,
          portrait: false,
          title: false,
          transparent: false
        }
      }
    },
    openEffect: 'zoom',
    closeEffect: 'zoom',
    slideEffect: 'slide',
    moreText: 'See more',
    moreLength: 60,
    cssEfects: {
      fade: {
        in: 'fadeIn',
        out: 'fadeOut'
      },
      zoom: {
        in: 'zoomIn',
        out: 'zoomOut'
      },
      slide: {
        in: 'slideInRight',
        out: 'slideOutLeft'
      },
      slideBack: {
        in: 'slideInLeft',
        out: 'slideOutRight'
      },
      none: {
        in: 'none',
        out: 'none'
      }
    },
    svg: {
      close: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>',
      next: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>',
      prev: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>'
    }
  }
  defaults.slideHTML = '<div class="gslide">\n    <div class="gslide-inner-content">\n        <div class="ginner-container">\n            <div class="gslide-media">\n            </div>\n            <div class="gslide-description">\n                <div class="gdesc-inner">\n                    <h4 class="gslide-title"></h4>\n                    <div class="gslide-desc"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>'
  defaults.lightboxHTML = '<div id="glightbox-body" class="glightbox-container" tabindex="-1" role="dialog" aria-hidden="false">\n    <div class="gloader visible"></div>\n    <div class="goverlay"></div>\n    <div class="gcontainer">\n    <div id="glightbox-slider" class="gslider"></div>\n    <button class="gclose gbtn" aria-label="Close" data-taborder="3">{closeSVG}</button>\n    <button class="gprev gbtn" aria-label="Previous" data-taborder="2">{prevSVG}</button>\n    <button class="gnext gbtn" aria-label="Next" data-taborder="1">{nextSVG}</button>\n</div>\n</div>'

  const GlightboxInit = (function () {
    function GlightboxInit () {
      const options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

      _classCallCheck(this, GlightboxInit)

      this.customOptions = options
      this.settings = extend(defaults, options)
      this.effectsClasses = this.getAnimationClasses()
      this.videoPlayers = {}
      this.apiEvents = []
      this.fullElementsList = false
    }

    _createClass(GlightboxInit, [{
      key: 'init',
      value: function init () {
        const _this = this

        const selector = this.getSelector()

        if (selector) {
          this.baseEvents = addEvent('click', {
            onElement: selector,
            withCallback: function withCallback (e, target) {
              e.preventDefault()

              _this.open(target)
            }
          })
        }

        this.elements = this.getElements()
      }
    }, {
      key: 'open',
      value: function open () {
        const element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
        const startAt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null

        if (this.elements.length === 0) {
          return false
        }

        this.activeSlide = null
        this.prevActiveSlideIndex = null
        this.prevActiveSlide = null
        let index = isNumber(startAt) ? startAt : this.settings.startAt

        if (isNode(element)) {
          const gallery = element.getAttribute('data-gallery')

          if (gallery) {
            this.fullElementsList = this.elements
            this.elements = this.getGalleryElements(this.elements, gallery)
          }

          if (isNil(index)) {
            index = this.getElementIndex(element)

            if (index < 0) {
              index = 0
            }
          }
        }

        if (!isNumber(index)) {
          index = 0
        }

        this.build()

        animateElement(this.overlay, this.settings.openEffect === 'none' ? 'none' : this.settings.cssEfects.fade.in)

        const body = document.body
        const scrollBar = window.innerWidth - document.documentElement.clientWidth

        if (scrollBar > 0) {
          const styleSheet = document.createElement('style')
          styleSheet.type = 'text/css'
          styleSheet.className = 'gcss-styles'
          styleSheet.innerText = '.gscrollbar-fixer {margin-right: '.concat(scrollBar, 'px}')
          document.head.appendChild(styleSheet)

          addClass(body, 'gscrollbar-fixer')
        }

        addClass(body, 'glightbox-open')

        addClass(html, 'glightbox-open')

        if (isMobile$1) {
          addClass(document.body, 'glightbox-mobile')

          this.settings.slideEffect = 'slide'
        }

        this.showSlide(index, true)

        if (this.elements.length === 1) {
          addClass(this.prevButton, 'glightbox-button-hidden')

          addClass(this.nextButton, 'glightbox-button-hidden')
        } else {
          removeClass(this.prevButton, 'glightbox-button-hidden')

          removeClass(this.nextButton, 'glightbox-button-hidden')
        }

        this.lightboxOpen = true
        this.trigger('open')

        if (isFunction(this.settings.onOpen)) {
          this.settings.onOpen()
        }

        if (isTouch$1 && this.settings.touchNavigation) {
          touchNavigation(this)
        }

        if (this.settings.keyboardNavigation) {
          keyboardNavigation(this)
        }
      }
    }, {
      key: 'openAt',
      value: function openAt () {
        const index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0
        this.open(null, index)
      }
    }, {
      key: 'showSlide',
      value: function showSlide () {
        const _this2 = this

        const index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0
        const first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false

        show(this.loader)

        this.index = parseInt(index)
        const current = this.slidesContainer.querySelector('.current')

        if (current) {
          removeClass(current, 'current')
        }

        this.slideAnimateOut()
        const slideNode = this.slidesContainer.querySelectorAll('.gslide')[index]

        if (hasClass(slideNode, 'loaded')) {
          this.slideAnimateIn(slideNode, first)

          hide(this.loader)
        } else {
          show(this.loader)

          const slide = this.elements[index]
          const slideData = {
            index: this.index,
            slide: slideNode,
            slideNode,
            slideConfig: slide.slideConfig,
            slideIndex: this.index,
            trigger: slide.node,
            player: null
          }
          this.trigger('slide_before_load', slideData)
          slide.instance.setContent(slideNode, function () {
            hide(_this2.loader)

            _this2.resize()

            _this2.slideAnimateIn(slideNode, first)

            _this2.trigger('slide_after_load', slideData)
          })
        }

        this.slideDescription = slideNode.querySelector('.gslide-description')
        this.slideDescriptionContained = this.slideDescription && hasClass(this.slideDescription.parentNode, 'gslide-media')

        if (this.settings.preload) {
          this.preloadSlide(index + 1)
          this.preloadSlide(index - 1)
        }

        this.updateNavigationClasses()
        this.activeSlide = slideNode
      }
    }, {
      key: 'preloadSlide',
      value: function preloadSlide (index) {
        const _this3 = this

        if (index < 0 || index > this.elements.length - 1) {
          return false
        }

        if (isNil(this.elements[index])) {
          return false
        }

        const slideNode = this.slidesContainer.querySelectorAll('.gslide')[index]

        if (hasClass(slideNode, 'loaded')) {
          return false
        }

        const slide = this.elements[index]
        const type = slide.type
        const slideData = {
          index,
          slide: slideNode,
          slideNode,
          slideConfig: slide.slideConfig,
          slideIndex: index,
          trigger: slide.node,
          player: null
        }
        this.trigger('slide_before_load', slideData)

        if (type === 'video' || type === 'external') {
          setTimeout(function () {
            slide.instance.setContent(slideNode, function () {
              _this3.trigger('slide_after_load', slideData)
            })
          }, 200)
        } else {
          slide.instance.setContent(slideNode, function () {
            _this3.trigger('slide_after_load', slideData)
          })
        }
      }
    }, {
      key: 'prevSlide',
      value: function prevSlide () {
        this.goToSlide(this.index - 1)
      }
    }, {
      key: 'nextSlide',
      value: function nextSlide () {
        this.goToSlide(this.index + 1)
      }
    }, {
      key: 'goToSlide',
      value: function goToSlide () {
        let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        this.prevActiveSlide = this.activeSlide
        this.prevActiveSlideIndex = this.index

        if (!this.loop() && (index < 0 || index > this.elements.length - 1)) {
          return false
        }

        if (index < 0) {
          index = this.elements.length - 1
        } else if (index >= this.elements.length) {
          index = 0
        }

        this.showSlide(index)
      }
    }, {
      key: 'insertSlide',
      value: function insertSlide () {
        const config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1

        if (index < 0) {
          index = this.elements.length
        }

        const slide = new Slide(config, this, index)
        const data = slide.getConfig()

        const slideInfo = extend({}, data)

        const newSlide = slide.create()
        const totalSlides = this.elements.length - 1
        slideInfo.index = index
        slideInfo.node = false
        slideInfo.instance = slide
        slideInfo.slideConfig = data
        this.elements.splice(index, 0, slideInfo)
        let addedSlideNode = null
        let addedSlidePlayer = null

        if (this.slidesContainer) {
          if (index > totalSlides) {
            this.slidesContainer.appendChild(newSlide)
          } else {
            const existingSlide = this.slidesContainer.querySelectorAll('.gslide')[index]
            this.slidesContainer.insertBefore(newSlide, existingSlide)
          }

          if (this.settings.preload && this.index == 0 && index == 0 || this.index - 1 == index || this.index + 1 == index) {
            this.preloadSlide(index)
          }

          if (this.index === 0 && index === 0) {
            this.index = 1
          }

          this.updateNavigationClasses()
          addedSlideNode = this.slidesContainer.querySelectorAll('.gslide')[index]
          addedSlidePlayer = this.getSlidePlayerInstance(index)
          slideInfo.slideNode = addedSlideNode
        }

        this.trigger('slide_inserted', {
          index,
          slide: addedSlideNode,
          slideNode: addedSlideNode,
          slideConfig: data,
          slideIndex: index,
          trigger: null,
          player: addedSlidePlayer
        })

        if (isFunction(this.settings.slideInserted)) {
          this.settings.slideInserted({
            index,
            slide: addedSlideNode,
            player: addedSlidePlayer
          })
        }
      }
    }, {
      key: 'removeSlide',
      value: function removeSlide () {
        const index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1

        if (index < 0 || index > this.elements.length - 1) {
          return false
        }

        const slide = this.slidesContainer && this.slidesContainer.querySelectorAll('.gslide')[index]

        if (slide) {
          if (this.getActiveSlideIndex() == index) {
            if (index == this.elements.length - 1) {
              this.prevSlide()
            } else {
              this.nextSlide()
            }
          }

          slide.parentNode.removeChild(slide)
        }

        this.elements.splice(index, 1)
        this.trigger('slide_removed', index)

        if (isFunction(this.settings.slideRemoved)) {
          this.settings.slideRemoved(index)
        }
      }
    }, {
      key: 'slideAnimateIn',
      value: function slideAnimateIn (slide, first) {
        const _this4 = this

        const slideMedia = slide.querySelector('.gslide-media')
        const slideDesc = slide.querySelector('.gslide-description')
        const prevData = {
          index: this.prevActiveSlideIndex,
          slide: this.prevActiveSlide,
          slideNode: this.prevActiveSlide,
          slideIndex: this.prevActiveSlide,
          slideConfig: isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].slideConfig,
          trigger: isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].node,
          player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
        }
        const nextData = {
          index: this.index,
          slide: this.activeSlide,
          slideNode: this.activeSlide,
          slideConfig: this.elements[this.index].slideConfig,
          slideIndex: this.index,
          trigger: this.elements[this.index].node,
          player: this.getSlidePlayerInstance(this.index)
        }

        if (slideMedia.offsetWidth > 0 && slideDesc) {
          hide(slideDesc)

          slideDesc.style.display = ''
        }

        removeClass(slide, this.effectsClasses)

        if (first) {
          animateElement(slide, this.settings.cssEfects[this.settings.openEffect].in, function () {
            if (_this4.settings.autoplayVideos) {
              _this4.slidePlayerPlay(slide)
            }

            _this4.trigger('slide_changed', {
              prev: prevData,
              current: nextData
            })

            if (isFunction(_this4.settings.afterSlideChange)) {
              _this4.settings.afterSlideChange.apply(_this4, [prevData, nextData])
            }
          })
        } else {
          const effectName = this.settings.slideEffect
          let animIn = effectName !== 'none' ? this.settings.cssEfects[effectName].in : effectName

          if (this.prevActiveSlideIndex > this.index) {
            if (this.settings.slideEffect == 'slide') {
              animIn = this.settings.cssEfects.slideBack.in
            }
          }

          animateElement(slide, animIn, function () {
            if (_this4.settings.autoplayVideos) {
              _this4.slidePlayerPlay(slide)
            }

            _this4.trigger('slide_changed', {
              prev: prevData,
              current: nextData
            })

            if (isFunction(_this4.settings.afterSlideChange)) {
              _this4.settings.afterSlideChange.apply(_this4, [prevData, nextData])
            }
          })
        }

        setTimeout(function () {
          _this4.resize(slide)
        }, 100)

        addClass(slide, 'current')
      }
    }, {
      key: 'slideAnimateOut',
      value: function slideAnimateOut () {
        if (!this.prevActiveSlide) {
          return false
        }

        const prevSlide = this.prevActiveSlide

        removeClass(prevSlide, this.effectsClasses)

        addClass(prevSlide, 'prev')

        const animation = this.settings.slideEffect
        let animOut = animation !== 'none' ? this.settings.cssEfects[animation].out : animation
        this.slidePlayerPause(prevSlide)
        this.trigger('slide_before_change', {
          prev: {
            index: this.prevActiveSlideIndex,
            slide: this.prevActiveSlide,
            slideNode: this.prevActiveSlide,
            slideIndex: this.prevActiveSlideIndex,
            slideConfig: isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].slideConfig,
            trigger: isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].node,
            player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
          },
          current: {
            index: this.index,
            slide: this.activeSlide,
            slideNode: this.activeSlide,
            slideIndex: this.index,
            slideConfig: this.elements[this.index].slideConfig,
            trigger: this.elements[this.index].node,
            player: this.getSlidePlayerInstance(this.index)
          }
        })

        if (isFunction(this.settings.beforeSlideChange)) {
          this.settings.beforeSlideChange.apply(this, [{
            index: this.prevActiveSlideIndex,
            slide: this.prevActiveSlide,
            player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
          }, {
            index: this.index,
            slide: this.activeSlide,
            player: this.getSlidePlayerInstance(this.index)
          }])
        }

        if (this.prevActiveSlideIndex > this.index && this.settings.slideEffect == 'slide') {
          animOut = this.settings.cssEfects.slideBack.out
        }

        animateElement(prevSlide, animOut, function () {
          const container = prevSlide.querySelector('.ginner-container')
          const media = prevSlide.querySelector('.gslide-media')
          const desc = prevSlide.querySelector('.gslide-description')
          container.style.transform = ''
          media.style.transform = ''

          removeClass(media, 'greset')

          media.style.opacity = ''

          if (desc) {
            desc.style.opacity = ''
          }

          removeClass(prevSlide, 'prev')
        })
      }
    }, {
      key: 'getAllPlayers',
      value: function getAllPlayers () {
        return this.videoPlayers
      }
    }, {
      key: 'getSlidePlayerInstance',
      value: function getSlidePlayerInstance (index) {
        const id = 'gvideo' + index
        const videoPlayers = this.getAllPlayers()

        if (has(videoPlayers, id) && videoPlayers[id]) {
          return videoPlayers[id]
        }

        return false
      }
    }, {
      key: 'stopSlideVideo',
      value: function stopSlideVideo (slide) {
        if (isNode(slide)) {
          const node = slide.querySelector('.gvideo-wrapper')

          if (node) {
            slide = node.getAttribute('data-index')
          }
        }

        console.log('stopSlideVideo is deprecated, use slidePlayerPause')
        const player = this.getSlidePlayerInstance(slide)

        if (player && player.playing) {
          player.pause()
        }
      }
    }, {
      key: 'slidePlayerPause',
      value: function slidePlayerPause (slide) {
        if (isNode(slide)) {
          const node = slide.querySelector('.gvideo-wrapper')

          if (node) {
            slide = node.getAttribute('data-index')
          }
        }

        const player = this.getSlidePlayerInstance(slide)

        if (player && player.playing) {
          player.pause()
        }
      }
    }, {
      key: 'playSlideVideo',
      value: function playSlideVideo (slide) {
        if (isNode(slide)) {
          const node = slide.querySelector('.gvideo-wrapper')

          if (node) {
            slide = node.getAttribute('data-index')
          }
        }

        console.log('playSlideVideo is deprecated, use slidePlayerPlay')
        const player = this.getSlidePlayerInstance(slide)

        if (player && !player.playing) {
          player.play()
        }
      }
    }, {
      key: 'slidePlayerPlay',
      value: function slidePlayerPlay (slide) {
        let _this$settings$plyr$c

        if (isMobile$1 && !((_this$settings$plyr$c = this.settings.plyr.config) !== null && _this$settings$plyr$c !== void 0 && _this$settings$plyr$c.muted)) {
          return
        }

        if (isNode(slide)) {
          const node = slide.querySelector('.gvideo-wrapper')

          if (node) {
            slide = node.getAttribute('data-index')
          }
        }

        const player = this.getSlidePlayerInstance(slide)

        if (player && !player.playing) {
          player.play()

          if (this.settings.autofocusVideos) {
            player.elements.container.focus()
          }
        }
      }
    }, {
      key: 'setElements',
      value: function setElements (elements) {
        const _this5 = this

        this.settings.elements = false
        const newElements = []

        if (elements && elements.length) {
          each(elements, function (el, i) {
            const slide = new Slide(el, _this5, i)
            const data = slide.getConfig()

            const slideInfo = extend({}, data)

            slideInfo.slideConfig = data
            slideInfo.instance = slide
            slideInfo.index = i
            newElements.push(slideInfo)
          })
        }

        this.elements = newElements

        if (this.lightboxOpen) {
          this.slidesContainer.innerHTML = ''

          if (this.elements.length) {
            each(this.elements, function () {
              const slide = createHTML(_this5.settings.slideHTML)

              _this5.slidesContainer.appendChild(slide)
            })

            this.showSlide(0, true)
          }
        }
      }
    }, {
      key: 'getElementIndex',
      value: function getElementIndex (node) {
        let index = false

        each(this.elements, function (el, i) {
          if (has(el, 'node') && el.node == node) {
            index = i
            return true
          }
        })

        return index
      }
    }, {
      key: 'getElements',
      value: function getElements () {
        const _this6 = this

        const list = []
        this.elements = this.elements ? this.elements : []

        if (!isNil(this.settings.elements) && isArray(this.settings.elements) && this.settings.elements.length) {
          each(this.settings.elements, function (el, i) {
            const slide = new Slide(el, _this6, i)
            const elData = slide.getConfig()

            const slideInfo = extend({}, elData)

            slideInfo.node = false
            slideInfo.index = i
            slideInfo.instance = slide
            slideInfo.slideConfig = elData
            list.push(slideInfo)
          })
        }

        let nodes = false
        const selector = this.getSelector()

        if (selector) {
          nodes = document.querySelectorAll(this.getSelector())
        }

        if (!nodes) {
          return list
        }

        each(nodes, function (el, i) {
          const slide = new Slide(el, _this6, i)
          const elData = slide.getConfig()

          const slideInfo = extend({}, elData)

          slideInfo.node = el
          slideInfo.index = i
          slideInfo.instance = slide
          slideInfo.slideConfig = elData
          slideInfo.gallery = el.getAttribute('data-gallery')
          list.push(slideInfo)
        })

        return list
      }
    }, {
      key: 'getGalleryElements',
      value: function getGalleryElements (list, gallery) {
        return list.filter(function (el) {
          return el.gallery == gallery
        })
      }
    }, {
      key: 'getSelector',
      value: function getSelector () {
        if (this.settings.elements) {
          return false
        }

        if (this.settings.selector && this.settings.selector.substring(0, 5) == 'data-') {
          return '*['.concat(this.settings.selector, ']')
        }

        return this.settings.selector
      }
    }, {
      key: 'getActiveSlide',
      value: function getActiveSlide () {
        return this.slidesContainer.querySelectorAll('.gslide')[this.index]
      }
    }, {
      key: 'getActiveSlideIndex',
      value: function getActiveSlideIndex () {
        return this.index
      }
    }, {
      key: 'getAnimationClasses',
      value: function getAnimationClasses () {
        const effects = []

        for (const key in this.settings.cssEfects) {
          if (this.settings.cssEfects.hasOwnProperty(key)) {
            const effect = this.settings.cssEfects[key]
            effects.push('g'.concat(effect.in))
            effects.push('g'.concat(effect.out))
          }
        }

        return effects.join(' ')
      }
    }, {
      key: 'build',
      value: function build () {
        const _this7 = this

        if (this.built) {
          return false
        }

        const children = document.body.childNodes
        const bodyChildElms = []

        each(children, function (el) {
          if (el.parentNode == document.body && el.nodeName.charAt(0) !== '#' && el.hasAttribute && !el.hasAttribute('aria-hidden')) {
            bodyChildElms.push(el)
            el.setAttribute('aria-hidden', 'true')
          }
        })

        const nextSVG = has(this.settings.svg, 'next') ? this.settings.svg.next : ''
        const prevSVG = has(this.settings.svg, 'prev') ? this.settings.svg.prev : ''
        const closeSVG = has(this.settings.svg, 'close') ? this.settings.svg.close : ''
        let lightboxHTML = this.settings.lightboxHTML
        lightboxHTML = lightboxHTML.replace(/{nextSVG}/g, nextSVG)
        lightboxHTML = lightboxHTML.replace(/{prevSVG}/g, prevSVG)
        lightboxHTML = lightboxHTML.replace(/{closeSVG}/g, closeSVG)
        lightboxHTML = createHTML(lightboxHTML)
        document.body.appendChild(lightboxHTML)
        const modal = document.getElementById('glightbox-body')
        this.modal = modal
        const closeButton = modal.querySelector('.gclose')
        this.prevButton = modal.querySelector('.gprev')
        this.nextButton = modal.querySelector('.gnext')
        this.overlay = modal.querySelector('.goverlay')
        this.loader = modal.querySelector('.gloader')
        this.slidesContainer = document.getElementById('glightbox-slider')
        this.bodyHiddenChildElms = bodyChildElms
        this.events = {}

        addClass(this.modal, 'glightbox-' + this.settings.skin)

        if (this.settings.closeButton && closeButton) {
          this.events.close = addEvent('click', {
            onElement: closeButton,
            withCallback: function withCallback (e, target) {
              e.preventDefault()

              _this7.close()
            }
          })
        }

        if (closeButton && !this.settings.closeButton) {
          closeButton.parentNode.removeChild(closeButton)
        }

        if (this.nextButton) {
          this.events.next = addEvent('click', {
            onElement: this.nextButton,
            withCallback: function withCallback (e, target) {
              e.preventDefault()

              _this7.nextSlide()
            }
          })
        }

        if (this.prevButton) {
          this.events.prev = addEvent('click', {
            onElement: this.prevButton,
            withCallback: function withCallback (e, target) {
              e.preventDefault()

              _this7.prevSlide()
            }
          })
        }

        if (this.settings.closeOnOutsideClick) {
          this.events.outClose = addEvent('click', {
            onElement: modal,
            withCallback: function withCallback (e, target) {
              if (!_this7.preventOutsideClick && !hasClass(document.body, 'glightbox-mobile') && !closest(e.target, '.ginner-container')) {
                if (!closest(e.target, '.gbtn') && !hasClass(e.target, 'gnext') && !hasClass(e.target, 'gprev')) {
                  _this7.close()
                }
              }
            }
          })
        }

        each(this.elements, function (slide, i) {
          _this7.slidesContainer.appendChild(slide.instance.create())

          slide.slideNode = _this7.slidesContainer.querySelectorAll('.gslide')[i]
        })

        if (isTouch$1) {
          addClass(document.body, 'glightbox-touch')
        }

        this.events.resize = addEvent('resize', {
          onElement: window,
          withCallback: function withCallback () {
            _this7.resize()
          }
        })
        this.built = true
      }
    }, {
      key: 'resize',
      value: function resize () {
        let slide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
        slide = !slide ? this.activeSlide : slide

        if (!slide || hasClass(slide, 'zoomed')) {
          return
        }

        const winSize = windowSize()

        const video = slide.querySelector('.gvideo-wrapper')
        const image = slide.querySelector('.gslide-image')
        const description = this.slideDescription
        const winWidth = winSize.width
        let winHeight = winSize.height

        if (winWidth <= 768) {
          addClass(document.body, 'glightbox-mobile')
        } else {
          removeClass(document.body, 'glightbox-mobile')
        }

        if (!video && !image) {
          return
        }

        let descriptionResize = false

        if (description && (hasClass(description, 'description-bottom') || hasClass(description, 'description-top')) && !hasClass(description, 'gabsolute')) {
          descriptionResize = true
        }

        if (image) {
          if (winWidth <= 768) {
            const imgNode = image.querySelector('img')
          } else if (descriptionResize) {
            const descHeight = description.offsetHeight

            const _imgNode = image.querySelector('img')

            _imgNode.setAttribute('style', 'max-height: calc(100vh - '.concat(descHeight, 'px)'))

            description.setAttribute('style', 'max-width: '.concat(_imgNode.offsetWidth, 'px;'))
          }
        }

        if (video) {
          let ratio = has(this.settings.plyr.config, 'ratio') ? this.settings.plyr.config.ratio : ''

          if (!ratio) {
            const containerWidth = video.clientWidth
            const containerHeight = video.clientHeight
            const divisor = containerWidth / containerHeight
            ratio = ''.concat(containerWidth / divisor, ':').concat(containerHeight / divisor)
          }

          const videoRatio = ratio.split(':')
          const videoWidth = this.settings.videosWidth
          let maxWidth = this.settings.videosWidth

          if (isNumber(videoWidth) || videoWidth.indexOf('px') !== -1) {
            maxWidth = parseInt(videoWidth)
          } else {
            if (videoWidth.indexOf('vw') !== -1) {
              maxWidth = winWidth * parseInt(videoWidth) / 100
            } else if (videoWidth.indexOf('vh') !== -1) {
              maxWidth = winHeight * parseInt(videoWidth) / 100
            } else if (videoWidth.indexOf('%') !== -1) {
              maxWidth = winWidth * parseInt(videoWidth) / 100
            } else {
              maxWidth = parseInt(video.clientWidth)
            }
          }

          let maxHeight = maxWidth / (parseInt(videoRatio[0]) / parseInt(videoRatio[1]))
          maxHeight = Math.floor(maxHeight)

          if (descriptionResize) {
            winHeight = winHeight - description.offsetHeight
          }

          if (maxWidth > winWidth || maxHeight > winHeight || winHeight < maxHeight && winWidth > maxWidth) {
            const vwidth = video.offsetWidth
            const vheight = video.offsetHeight

            const _ratio = winHeight / vheight

            const vsize = {
              width: vwidth * _ratio,
              height: vheight * _ratio
            }
            video.parentNode.setAttribute('style', 'max-width: '.concat(vsize.width, 'px'))

            if (descriptionResize) {
              description.setAttribute('style', 'max-width: '.concat(vsize.width, 'px;'))
            }
          } else {
            video.parentNode.style.maxWidth = ''.concat(videoWidth)

            if (descriptionResize) {
              description.setAttribute('style', 'max-width: '.concat(videoWidth, ';'))
            }
          }
        }
      }
    }, {
      key: 'reload',
      value: function reload () {
        this.init()
      }
    }, {
      key: 'updateNavigationClasses',
      value: function updateNavigationClasses () {
        const loop = this.loop()

        removeClass(this.nextButton, 'disabled')

        removeClass(this.prevButton, 'disabled')

        if (this.index == 0 && this.elements.length - 1 == 0) {
          addClass(this.prevButton, 'disabled')

          addClass(this.nextButton, 'disabled')
        } else if (this.index === 0 && !loop) {
          addClass(this.prevButton, 'disabled')
        } else if (this.index === this.elements.length - 1 && !loop) {
          addClass(this.nextButton, 'disabled')
        }
      }
    }, {
      key: 'loop',
      value: function loop () {
        let loop = has(this.settings, 'loopAtEnd') ? this.settings.loopAtEnd : null
        loop = has(this.settings, 'loop') ? this.settings.loop : loop
        return loop
      }
    }, {
      key: 'close',
      value: function close () {
        const _this8 = this

        if (!this.lightboxOpen) {
          if (this.events) {
            for (const key in this.events) {
              if (this.events.hasOwnProperty(key)) {
                this.events[key].destroy()
              }
            }

            this.events = null
          }

          return false
        }

        if (this.closing) {
          return false
        }

        this.closing = true
        this.slidePlayerPause(this.activeSlide)

        if (this.fullElementsList) {
          this.elements = this.fullElementsList
        }

        if (this.bodyHiddenChildElms.length) {
          each(this.bodyHiddenChildElms, function (el) {
            el.removeAttribute('aria-hidden')
          })
        }

        addClass(this.modal, 'glightbox-closing')

        animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.out)

        animateElement(this.activeSlide, this.settings.cssEfects[this.settings.closeEffect].out, function () {
          _this8.activeSlide = null
          _this8.prevActiveSlideIndex = null
          _this8.prevActiveSlide = null
          _this8.built = false

          if (_this8.events) {
            for (const _key in _this8.events) {
              if (_this8.events.hasOwnProperty(_key)) {
                _this8.events[_key].destroy()
              }
            }

            _this8.events = null
          }

          const body = document.body

          removeClass(html, 'glightbox-open')

          removeClass(body, 'glightbox-open touching gdesc-open glightbox-touch glightbox-mobile gscrollbar-fixer')

          _this8.modal.parentNode.removeChild(_this8.modal)

          _this8.trigger('close')

          if (isFunction(_this8.settings.onClose)) {
            _this8.settings.onClose()
          }

          const styles = document.querySelector('.gcss-styles')

          if (styles) {
            styles.parentNode.removeChild(styles)
          }

          _this8.lightboxOpen = false
          _this8.closing = null
        })
      }
    }, {
      key: 'destroy',
      value: function destroy () {
        this.close()
        this.clearAllEvents()

        if (this.baseEvents) {
          this.baseEvents.destroy()
        }
      }
    }, {
      key: 'on',
      value: function on (evt, callback) {
        const once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false

        if (!evt || !isFunction(callback)) {
          throw new TypeError('Event name and callback must be defined')
        }

        this.apiEvents.push({
          evt,
          once,
          callback
        })
      }
    }, {
      key: 'once',
      value: function once (evt, callback) {
        this.on(evt, callback, true)
      }
    }, {
      key: 'trigger',
      value: function trigger (eventName) {
        const _this9 = this

        const data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
        const onceTriggered = []

        each(this.apiEvents, function (event, i) {
          const evt = event.evt
          const once = event.once
          const callback = event.callback

          if (evt == eventName) {
            callback(data)

            if (once) {
              onceTriggered.push(i)
            }
          }
        })

        if (onceTriggered.length) {
          each(onceTriggered, function (i) {
            return _this9.apiEvents.splice(i, 1)
          })
        }
      }
    }, {
      key: 'clearAllEvents',
      value: function clearAllEvents () {
        this.apiEvents.splice(0, this.apiEvents.length)
      }
    }, {
      key: 'version',
      value: function version () {
        return _version
      }
    }])

    return GlightboxInit
  }())

  function glightbox () {
    const options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
    const instance = new GlightboxInit(options)
    instance.init()
    return instance
  }

  return glightbox
}))
