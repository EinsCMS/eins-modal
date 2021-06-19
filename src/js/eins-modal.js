/* eslint-disable max-len */
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import Velocity from 'velocity-animate/velocity'
import 'velocity-animate/velocity.ui'

export default {
  modalClass: 'eins-modal',
  /**
   * Suffixes of all eins-modal elements
   */
  classSuffixes: {
    backdrop: '-backdrop',
    content: '-content',
    openButton: '-button',
    closeButton: '-close-button',
    closeIcon: '-close'
  },
  /**
   * Backdrop element.
   * @var {HTMLElement|null}
   */
  backdrop: null,
  /**
   * Default options.
   * @var {object}
   */
  defaultOptions: {
    openTransition: 'transition.bounceIn',
    openTransitionDuration: 400,
    closeTransition: 'transition.expandOut',
    closeTransitionDuration: 200,
    backdropClose: 'true'
  },
  /**
   * All event objects are stored here.
   * @var {object}
   */
  events: {
    show: null,
    shown: null,
    hide: null,
    hidden: null,
    global: null
  },
  /**
   * Currently open modal element.
   * @var {HTMLElement|null}
   */
  currentOpenModal: null,
  /**
   * Options object used for current action.
   * @var {object|null}
   */
  currentOptions: null,
  /**
   * If any action is caused by a click, the clicked Element will be stored here.
   * @var {HTMLElement|null}
   */
  currentTrigger: null,
  /**
   * Global event handler to close current open modal.
   * @var {function|null}
   */
  closeModalEventHandler: null,
  /**
   * Global event handler to open a modal.
   * @var {function|null}
   */
  openModalEventHandler: null,
  /**
   * Initialize EinsModal
   * @param {string|null} modalClass class of modal and prefix of all other classes elements
   */
  init(modalClass = null) {
    if (modalClass !== null) {
      this.modalClass = modalClass
    }
    this.initDefaultState()

    this.initEvents()
    this.initEventHandlerClosures()
    this.initButtonEvents()

    this.createBackdrop()

    this.addClosureToModal()

    this.initGlobalObject()
  },
  /**
   * Hide all modals on page-load.
   */
  initDefaultState() {
    const modals = document.getElementsByClassName(this.modalClass)
    const modalsLength = modals.length
    if (modalsLength === 0) {
      return
    }
    // hide all modals
    for (let i = 0; i < modalsLength; i += 1) {
      const modal = modals[i]
      modal.style.display = 'none'
    }
  },
  /**
   * Initialize all "event.eins.modal" events.
   */
  initEvents() {
    const events = [
      'show.eins.modal',
      'shown.eins.modal',
      'hide.eins.modal',
      'hidden.eins.modal',
      'global.eins.modal'
    ]
    for (let i = 0; i < events.length; i += 1) {
      const eventName = events[i]
      const eventKey = eventName.split('.')[0]
      const event = document.createEvent('Event')
      event.initEvent(eventName, true, true)
      this.events[eventKey] = event
    }
  },
  /**
   * Initialize global event handler closures.
   */
  initEventHandlerClosures() {
    const EinsModal = this
    if (this.closeModalEventHandler === null) {
      // eslint-disable-next-line func-names
      this.closeModalEventHandler = function(e) {
        /* event handler */
        if (e.target !== this) return
        if (EinsModal.backdrop.getAttribute('listener') === 'true') {
          EinsModal.removeListener(EinsModal.backdrop, EinsModal.closeModalEventHandler)
          EinsModal.removeListener(EinsModal.currentOpenModal, EinsModal.closeModalEventHandler)
          EinsModal.backdrop.setAttribute('listener', 'false')
        }
        EinsModal.currentTrigger = this
        EinsModal.close(null)
      }
    }
    if (this.openModalEventHandler === null) {
      // eslint-disable-next-line func-names
      this.openModalEventHandler = function() {
        const modalToOpenId = this.getAttribute('data-modal-id')
        const buttonOptions = this.getAttribute('data-modal-options')
        const modalToOpen = document.getElementById(modalToOpenId)

        if (modalToOpen === null) {
          EinsModal.log('error', 'Could not find modal to open.')
          return
        }

        const modalOptions = modalToOpen.getAttribute('data-options')

        EinsModal.currentOptions = EinsModal.getOptions([ modalOptions, buttonOptions ])
        EinsModal.currentTrigger = this

        // open new modal
        EinsModal.open(modalToOpen)
      }
    }
  },
  /**
   * Add click and touch events to all trigger buttons on page.
   */
  initButtonEvents() {
    const EinsModal = this
    const openButtons = document.getElementsByClassName(EinsModal.getClass('openButton'))

    /* Add event handler to buttons */
    if (openButtons.length > 0) {
      for (let i = 0; i < openButtons.length; i += 1) {
        const openButton = openButtons[i]
        openButton.addEventListener('click', this.openModalEventHandler)
        openButton.addEventListener('touch', this.openModalEventHandler)
      }
    }
  },
  /**
   * Creates backdrop element and adds it to the body element.
   */
  createBackdrop() {
    // create and insert backdrop to body
    const backdrop = document.createElement('div')
    backdrop.className += this.getClass('backdrop')

    document.getElementsByTagName('body')[0].appendChild(backdrop)

    this.backdrop = backdrop
  },
  /**
   * Add the ".modal()" closure to one or all modal elements.
   * Will add the ".modal()" method to all modal elements if element is null.
   * @param {HTMLElement|null} element modal element.
   */
  addClosureToModal(element = null) {
    const modals =
      typeof element !== 'object' || element === null ? document.getElementsByClassName(this.modalClass) : [ element ]

    const EinsModal = this
    if (modals === null) {
      return
    }

    for (let i = 0; i < modals.length; i += 1) {
      const modal = modals[i]
      modal.modal = EinsModal.getClosureForModal()
    }
  },
  /**
   * Attaches object with closures to global window object. "window.einsModal"
   */
  initGlobalObject() {
    const EinsModal = this
    window.einsModal = {
      /**
       * Add ".modal()" method to a modal and/or add an event listener to an trigger button and/or assign a trigger to a modal.
       * @param {string|HTMLElement|null} modalElementOrId 
       * @param {string|HTMLElement|null} triggerElementOrId 
       */
      add(modalElementOrId = null, triggerElementOrId = null) {
        EinsModal.add(modalElementOrId, triggerElementOrId)
      },
      /**
       * Open a modal with its id or element.
       * @param {string|HTMLElement} modalElementOrId 
       * @param {object|null} options 
       */
      open(modalElementOrId, options = null) {
        const modalToOpen =
          typeof modalElementOrId === 'string' ? document.getElementById(modalElementOrId) : modalElementOrId
        const modalOptions = modalToOpen.getAttribute('data-options')
        EinsModal.currentOptions = EinsModal.getOptions([ modalOptions, options ])
        EinsModal.open(modalToOpen)
      },
      /**
       * Close current open modal.
       * @param {object|null} options 
       */
      close(options = null) {
        EinsModal.currentOptions = EinsModal.getOptions([ EinsModal.currentOptions, options ])
        EinsModal.close()
      },
      /**
       * Override default options.
       * @param {object} options 
       */
      setDefaultOptions(options) {
        if (options === null) {
          EinsModal.log('error', 'Could not override the default options. Expected options object, null given.')
          return
        }
        EinsModal.defaultOptions = EinsModal.getOptions([ options ])
      }
    }
    window.dispatchEvent(EinsModal.events.global)
  },
  /**
   * Add click and touch event listeners to one element.
   * @param {HTMLElement} element 
   * @param {function} handler 
   * @returns 
   */
  addListener(element, handler) {
    if (element.getAttribute('lister') === 'true') {
      return
    }
    element.addEventListener('click', handler)
    element.addEventListener('touch', handler)
    element.setAttribute('listener', 'true')
  },
  /**
   * Add click and touch event listeners to multiple elements.
   * @param {[HTMLElement]} elements 
   * @param {function} handler 
   */
  addListeners(elements, handler) {
    const EinsModal = this
    if (elements.length > 0) {
      for (let i = 0; i < elements.length; i += 1) {
        const element = elements[0]
        EinsModal.addListener(element, handler)
      }
    }
  },
  /**
   * Remove click and touch Listener from one element.
   * @param {HTMLElement} element
   * @param {function} handler 
   * @returns 
   */
  removeListener(element, handler) {
    if (element.getAttribute('listener') !== 'true') {
      return
    }
    element.removeEventListener('click', handler)
    element.removeEventListener('touch', handler)
    element.setAttribute('listener', 'false')
  },
  /**
   * Retrieve the modal-content element.
   * @param {HTMLElement} modal modal element
   * @returns {HTMLElement|null}
   */
  getModalContentElement(modal) {
    if (modal === null) {
      return null
    }
    const modalContent = modal.querySelectorAll('.' + this.getClass('content'))
    if (modalContent.length > 0) {
      return modalContent[0]
    }
    return null
  },
  /**
   * Merges default options with optionsArray and returns merged options object.
   * @param {array} optionsArray 
   * @returns {object}
   */
  getOptions(optionsArray) {
    if (!Array.isArray(optionsArray)) {
      return this.defaultOptions
    }

    const options = { ...this.defaultOptions }

    for (let i = 0; i < optionsArray.length; i += 1) {
      const optionString = optionsArray[i]
      if (typeof optionString === 'string') {
        // example: "openTransition: transition.bounceIn; backdropClose: false;"
        const optionsSplitted = optionString.split(';')
        for (let j = 0; j < optionsSplitted.length; j += 1) {
          const optionArray = optionsSplitted[j].split(':')
          if (optionArray.length === 2) {
            const [ optionKey, optionValue ] = optionArray
            const keyTrimmed = optionKey.replace(/^\s+|\s+$/g, '') // remove white spaces from key
            options[keyTrimmed] = optionValue.replace(/^\s+|\s+$/g, '') // and value
          }
        }
      } else if (typeof optionString === 'object' && optionString !== null) {
        const option = optionString
        const optionKeys = Object.keys(option)
        for (let j = 0; j < optionKeys.length; j += 1) {
          const optionKey = optionKeys[j]
          const optionValue = option[optionKey]
          options[optionKey] = optionValue
        }
      }
    }
    return options
  },
  getClass(classSuffixKey) {
    if (typeof this.classSuffixes[classSuffixKey] === 'undefined') {
      this.log('error', 'Class suffix key does not exist!')
      return null
    }
    return this.modalClass + this.classSuffixes[classSuffixKey]
  },
  /**
   * Helper function to open the modal.
   * @param {HTMLElement} modalToOpen 
   */
  openHelper(modalToOpen) {
    const EinsModal = this
    if (modalToOpen === null) {
      EinsModal.log('error', 'Could not find modal to open.')
      return
    }
    const modalContent = EinsModal.getModalContentElement(modalToOpen)
    if (modalContent === null) {
      EinsModal.log('error', 'Could not find modal content to open.')
      return
    }

    const options = EinsModal.currentOptions

    if (options === null || !('openTransition' in options) || !('openTransitionDuration' in options)) {
      EinsModal.log('error', 'Current options are malformed.')
      return
    }

    disableBodyScroll(modalToOpen, {
      reserveScrollBarGap: true
    })

    EinsModal.backdrop.style.display = 'block'
    modalToOpen.style.display = 'block'

    this.events.show.relatedTarget = this.currentTrigger
    modalToOpen.dispatchEvent(this.events.show)

    Velocity(modalContent, options.openTransition, {
      duration: options.openTransitionDuration,
      complete() {
        // changing display is repeated due to fixing a bug..
        EinsModal.backdrop.style.display = 'block'
        modalToOpen.style.display = 'block'
        EinsModal.currentOpenModal = modalToOpen
        EinsModal.events.shown.relatedTarget = EinsModal.currentTrigger
        modalToOpen.dispatchEvent(EinsModal.events.shown)
        EinsModal.currentTrigger = null
      }
    })
  },
  /**
   * Open a modal.
   * @param {HTMLElement} modalToOpen 
   */
  open(modalToOpen) {
    const EinsModal = this

    const closeButtons = modalToOpen.querySelectorAll('.' + EinsModal.getClass('closeButton'))
    EinsModal.addListeners(closeButtons, this.closeModalEventHandler)

    const closeIcons = modalToOpen.querySelectorAll('.' + EinsModal.getClass('closeIcon'))
    EinsModal.addListeners(closeIcons, this.closeModalEventHandler)

    if (this.currentOptions === null) {
      EinsModal.log('warn', 'Something went wrong.. Could not find current options. Using default options instead.')
      this.currentOptions = this.getOptions()
    }

    // eslint-disable-next-line eqeqeq
    if (this.currentOptions.backdropClose == 'true') {
      EinsModal.addListener(EinsModal.backdrop, this.closeModalEventHandler)
      EinsModal.addListener(modalToOpen, this.closeModalEventHandler)
      EinsModal.backdrop.setAttribute('listener', 'true')
    }

    // if no modal was open, we open one
    if (EinsModal.close(modalToOpen) === false) {
      EinsModal.openHelper(modalToOpen)
    }
  },
  /**
   * Close current open modal.
   * @param {HTMLElement|null} modalToOpen element to open after close
   * @returns {boolean}
   */
  close(modalToOpen = null) {
    if (this.currentOpenModal === null) {
      return false
    }

    const EinsModal = this

    const options = EinsModal.currentOptions === null ? EinsModal.currentOptions : { ...EinsModal.defaultOptions }

    const modalContent = EinsModal.getModalContentElement(EinsModal.currentOpenModal)

    if (modalContent === null) {
      EinsModal.log('error', 'No modal content found')
      return false
    }

    this.events.hide.relatedTarget = this.currentTrigger
    EinsModal.currentOpenModal.dispatchEvent(this.events.hide)

    Velocity(modalContent, options.closeTransition, {
      duration: options.closeTransitionDuration,
      complete() {
        EinsModal.events.hidden.relatedTarget = EinsModal.currentTrigger
        EinsModal.currentOpenModal.dispatchEvent(EinsModal.events.hidden)
        EinsModal.currentTrigger = null
        if (modalToOpen !== null) {
          EinsModal.openHelper(modalToOpen, options)
          return
        }
        // hide backdrop
        EinsModal.backdrop.style.display = 'none'
        EinsModal.currentOpenModal.style.display = 'none'
        EinsModal.currentOpenModal = null
        clearAllBodyScrollLocks()
      }
    })
    return true
  },
  /**
   * Returns a closure that can be attached to an modal element. ".modal()"
   * @returns {function}
   */
  getClosureForModal() {
    const EinsModal = this
    const closure = function(methodName, options = null) {
      const dataOptions = this.getAttribute('data-options')
      EinsModal.currentOptions = EinsModal.getOptions([ dataOptions, options ])
      switch (methodName) {
        case 'show':
          EinsModal.open(this)
          break
        case 'hide':
          EinsModal.close(null)
          break
        case 'toggle':
          if (EinsModal.currentOpenModal === null) {
            EinsModal.open(this)
          } else {
            EinsModal.close(null)
          }
          break
        default:
          EinsModal.log('error', 'Method "' + methodName + '" not allowed.')
          break
      }
    }
    return closure
  },
  /**
   * Add ".modal()" method to a modal and/or add an event listener to an trigger button and/or assign a trigger to a modal.
   * @param {HTMLElement|string|null} modalElementOrId 
   * @param {HTMLElement|string|null} triggerElementOrId 
   */
  add(modalElementOrId = null, triggerElementOrId = null) {
    const EinsModal = this

    const modalElement =
      typeof modalElementOrId === 'string' ? document.getElementById(modalElementOrId) : modalElementOrId

    if (modalElement !== null) {
      this.addClosureToModal(modalElement)
    }

    const customOpenModalEventHandler = function() {
      const buttonOptions = this.getAttribute('data-modal-options')

      const modalToOpenId = this.getAttribute('data-modal-id')

      let modalToOpen = null

      if (modalElement !== null) {
        modalToOpen = modalElement
      } else if (modalToOpenId !== null && modalToOpenId !== '') {
        modalToOpen = document.getElementById(modalToOpenId)
      }

      if (modalToOpen === null) {
        EinsModal.log('error', 'Could not find modal to open.')
        return
      }

      const modalOptions = modalToOpen.getAttribute('data-options')

      EinsModal.currentOptions = EinsModal.getOptions([ modalOptions, buttonOptions ])

      EinsModal.currentTrigger = this

      // open new modal
      EinsModal.open(modalToOpen)
    }

    const triggerElement =
      typeof triggerElementOrId === 'string' ? document.getElementById(triggerElementOrId) : triggerElementOrId

    if (triggerElement !== null) {
      triggerElement.addEventListener('click', customOpenModalEventHandler)
      triggerElement.addEventListener('touch', customOpenModalEventHandler)
    }
  },
  /**
   * Log something to the console if available.
   * @param {string} level log level, for example "error", "warn", "log", "info"
   * @param {string} message 
   */
  log(level, message) {
    if (!window.console) {
      return
    }
    const { console } = window
    if (typeof console[level] === 'function') {
      console[level](message)
    }
  }
}
