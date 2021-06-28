import Store from './store'
import Log from './log'

/**
 * All event objects are stored here.
 * @var {object}
 */
const events = {
  show: null,
  shown: null,
  hide: null,
  hidden: null,
  global: null,
  removeListener: null
}

const EventHelper = {
  initEvents() {
    const eventsArray = [
      'show.eins.modal',
      'shown.eins.modal',
      'hide.eins.modal',
      'hidden.eins.modal',
      'global.eins.modal',
      'removeListener.eins.modal'
    ]
    for (let i = 0; i < eventsArray.length; i += 1) {
      const eventName = eventsArray[i]
      const eventKey = eventName.split('.')[0]
      const event = document.createEvent('Event')
      event.initEvent(eventName, true, true)
      events[eventKey] = event
    }
  },
  get events() {
    return events
  },

  _eventAttribute: 'data-modal-listener',
  get eventAttribute() {
    return this._eventAttribute
  },
  set eventAttribute(value) {
    this._eventAttribute = value
  },

  /**
   * @param {HTMLElement} element
   * @param {string} type "close" or "open"
   * @return {boolean}
   */
  addEventAttribute(element, type) {
    if (element === null) {
      Log('error', 'Could not add event attribute. Element is null.')
      return false
    }
    if (type !== 'close' && type !== 'open') {
      Log('error', 'Could not add event attribute. Type "' + type + '" is not supported.')
      return false
    }
    const eventAttributeString = element.getAttribute(this.eventAttribute)
    if (eventAttributeString === null || eventAttributeString === '') {
      element.setAttribute(this.eventAttribute, type)
      return true
    }
    const eventAttributes = eventAttributeString.split('|')
    for (let i = 0; i < eventAttributes.length; i += 1) {
      const eventAttr = eventAttributes[i]
      if (eventAttr === type) {
        Log('error', 'Could not add event attribute. Type ' + type + ' already exists.')
        return false
      }
    }
    eventAttributes.push(type)
    return element.setAttribute(this.eventAttribute, eventAttributes.join('|'))
  },
  /**
   * 
   * @param {*} element 
   * @param {string} type "close" or "open"
   * @returns {boolean}
   */
  hasEventAttribute(element, type) {
    if (element === null) {
      Log('error', 'Element is null.')
      return true
    }
    if (type !== 'close' && type !== 'open') {
      Log('error', 'Type "' + type + '" is not supported')
      return true
    }
    const eventAttributeString = element.getAttribute(this.eventAttribute)
    if (eventAttributeString === null || eventAttributeString === '') {
      return false
    }
    const eventAttributes = eventAttributeString.split('|')
    for (let i = 0; i < eventAttributes.length; i += 1) {
      const eventAttr = eventAttributes[i]
      if (eventAttr === type) {
        return true
      }
    }
    return false
  },
  /**
   * 
   * @param {*} element 
   * @param {string} type "close" or "open"
   * @returns {boolean}
   */
  removeEventAttribute(element, type) {
    if (element === null) {
      Log('error', 'Element is null.')
      return false
    }
    if (type !== 'close' && type !== 'open') {
      Log('error', 'Type "' + type + '" is not supported')
      return false
    }
    const eventAttributeString = element.getAttribute(this.eventAttribute)
    if (eventAttributeString === null || eventAttributeString === '') {
      return true
    }
    const eventAttributes = eventAttributeString.split('|')
    const eventAttrs = []
    for (let i = 0; i < eventAttributes.length; i += 1) {
      const eventAttr = eventAttributes[i]
      if (eventAttr !== type) {
        eventAttrs.push(eventAttr)
      }
    }
    element.setAttribute(this.eventAttribute, eventAttrs.join('|'))
    return true
  },
  addListener(element, handler, type) {
    if (element === null || this.hasEventAttribute(element, type)) {
      return
    }
    if (type === 'close' && Store.modalToOpen.id !== null && Store.modalToOpen.id !== '') {
      element.setAttribute('data-modal-to-close', Store.modalToOpen.id)
    }
    element.addEventListener('click', handler)
    element.addEventListener('touch', handler)
    element.addEventListener(events.removeListener.type, handler)
    this.addEventAttribute(element, type)
  },
  addListeners(elements, handler, type) {
    if (elements === null || elements.length === 0) {
      return
    }
    for (let i = 0; i < elements.length; i += 1) {
      const element = elements[i]
      this.addListener(element, handler, type)
    }
  },
  removeListener(element, handler, type) {
    if (element === null || !this.hasEventAttribute(element, type)) {
      return
    }
    element.removeEventListener('click', handler)
    element.removeEventListener('touch', handler)
    element.removeEventListener(this.events.removeListener.type, handler)
    this.removeEventAttribute(element, type)
  },

  dispatch(element, event) {
    event.relatedTarget = Store.trigger
    element.dispatchEvent(event)
  },
  dispatchRemove(element) {
    this.dispatch(element, events.removeListener)
  },
  dispatchShow(element) {
    this.dispatch(element, events.show)
  },
  dispatchShown(element) {
    this.dispatch(element, events.shown)
  },
  dispatchHide(element) {
    this.dispatch(element, events.hide)
  },
  dispatchHidden(element) {
    this.dispatch(element, events.hidden)
  },
  dispatchGlobal() {
    window.dispatchEvent(events.global)
  }
}

EventHelper.initEvents()

export default EventHelper
