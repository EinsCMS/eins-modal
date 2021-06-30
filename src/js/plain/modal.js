import { enablePageScroll, disablePageScroll, addFillGapTarget } from 'scroll-lock'

import EventHelper from '../event-helper'
import Store from '../store'
import Queue from '../queue'
import Log from '../log'
import Scrollbar from '../scrollbar'
import Backdrop from '../backdrop'
import Elements from '../elements'

const Modal = {
  _doOpen() {
    if (Store.processing === false) {
      Store.processing = true
    } else {
      Queue.waitingActions = {
        type: 'open',
        content: {
          modal: Store.modalToOpen,
          options: Store.options,
          trigger: Store.trigger
        }
      }
      return false
    }

    if (Queue.openModals.length === 0) {
      return true
    }
    if (Store.options.wait === 'true' || Store.options.wait === true) {
      Queue.waitingActions = {
        type: 'open',
        content: {
          modal: Store.modalToOpen,
          options: Store.options,
          trigger: Store.trigger
        }
      }
      Store.processing = false
      return false
    }
    if (Store.options.multiple === 'false' || Store.options.multiple === false) {
      Queue.nextAction = {
        type: 'open',
        content: {
          modal: Store.modalToOpen,
          options: Store.options,
          trigger: Store.trigger
        }
      }
      for (let i = 0; i < Queue.openModals.length; i += 1) {
        const { modal, options } = Queue.openModals[i]
        Queue.nextAction = {
          type: 'close',
          content: {
            modal,
            options,
            trigger: Store.trigger
          }
        }
      }
      Store.processing = false
      this._handleQueue()
      return false
    }
    if (Queue.isModalOpen(Store.modalToOpen)) {
      Queue.nextAction = {
        type: 'open',
        content: {
          modal: Store.modalToOpen,
          options: Store.options,
          trigger: Store.trigger
        }
      }
      Store.processing = false
      if (Store.wasCloseAction === true) {
        Backdrop.remove()
      }
      this.close(Store.modalToOpen, Store.trigger, Store.options)
      return false
    }

    return true
  },
  /**
   * Open a modal.
   * @param {HTMLElement} modalToOpen
   * @param {HTMLElement|null} trigger
   * @param {object|null} options
   */
  open(modalToOpen, trigger = null, options = null) {
    if (typeof modalToOpen !== 'object' || modalToOpen === null) {
      Log('error', 'Could not find modal to open.')
      return
    }

    EventHelper.dispatchShow(modalToOpen)

    Store.modalToOpen = modalToOpen
    Store.trigger = trigger
    Store.options = options

    if (this._doOpen() === false) {
      return
    }

    // remove open listener of modal after it was closed before
    if (EventHelper.hasEventAttribute(modalToOpen, 'open')) {
      EventHelper.removeListener(modalToOpen, this._openHandler, 'open')
    }

    // add close handlers for everything
    Backdrop.create()
    Modal.addCloseHandlers(Elements.closeButtons)
    Modal.addCloseHandlers(Elements.closeIcons)

    if (Store.options.backdropClose === 'true' || Store.options.backdropClose === true) {
      Modal.addCloseHandler(Store.backdrop)
      Modal.addCloseHandler(modalToOpen)
    }

    // add open handlers related to current modal to open
    Modal.addOpenHandlers(Elements.openButtonsInModal)

    const dataModalIdOfModalToOpen = modalToOpen.getAttribute('data-modal-id')
    if (dataModalIdOfModalToOpen !== null && dataModalIdOfModalToOpen !== '') {
      Modal.addOpenHandler(modalToOpen)
      Modal.addOpenHandler(Store.backdrop)
    }

    const { modalContent } = Elements
    if (modalContent === null) {
      Log('error', 'Could not find modal content to open.')
      return
    }

    addFillGapTarget(modalToOpen)
    disablePageScroll(modalToOpen)

    Backdrop.show()
    Scrollbar.hide(modalToOpen, modalContent)

    modalContent.style.display = 'block'
    modalContent.style.opacity = '1'

    // dispatch shown event
    EventHelper.dispatchShown(modalToOpen)

    Scrollbar.hidePrevious()

    // need to be between show and hide because show resets something in store
    Queue.openModals = {
      modal: modalToOpen,
      options: Store.options,
      backdrop: Store.backdrop,
      paddingRight: Store.paddingRight
    }

    Scrollbar.show(modalToOpen)

    Store.processing = false
    Store.wasCloseAction = false

    // padding-right reset done in scrollbar show

    // handle queues
    if (Modal._handleQueue() === true) {
      return
    }
    Store.reset()
  },
  _doClose() {
    if (Store.processing === false) {
      Store.processing = true
    } else {
      Queue.waitingActions = {
        type: 'close',
        content: {
          options: Store.options,
          trigger: Store.trigger,
          modal: Store.modalToClose
        }
      }
      return false
    }

    if (Queue.openModals.length === 0) {
      Store.processing = false
      this._handleQueue()
      // there is nothing to close
      return false
    }

    return true
  },
  /**
   * Close a modal.
   * @param {HTMLElement|null} modalToOpen close a specific modal, not the last opened
   * @param {HTMLElement|null} trigger
   * @param {object|null} options
   */
  close(modalToClose = null, trigger = null, options = null) {
    Store.modalToClose = modalToClose
    Store.trigger = trigger
    Store.options = options

    if (this._doClose() === false) {
      return
    }

    const openModal = Queue.removeOpenModal()

    if (openModal === null) {
      Store.processing = false
      this._handleQueue()
      return
    }

    // a new listener will be attached when opening a modal
    EventHelper.dispatchRemove(openModal)

    const modalContent = Elements.getModalContent(openModal)
    if (modalContent === null) {
      Log('error', 'No modal content found')
      return
    }

    EventHelper.dispatchHide(openModal)

    Scrollbar.hide(openModal, modalContent)

    modalContent.style.opacity = '0'
    modalContent.style.display = 'none'

    EventHelper.dispatchHidden(openModal)

    Scrollbar.show(openModal)

    // scroll modal to top or modal will jump to scroll position if reopened
    openModal.style.visibility = 'hidden'
    modalContent.style.display = 'block'
    openModal.scrollTop = 0
    modalContent.style.display = 'none'
    openModal.style.visibility = 'visible'
    // hide open modal completely
    openModal.style.display = 'none'

    enablePageScroll(openModal)

    Scrollbar.showNext()

    Store.processing = false
    Store.wasCloseAction = true

    // handle queues
    if (Modal._handleQueue() === true) {
      return
    }

    Backdrop.remove()
    Store.reset()
    // EinsModal.backdrop.style.display = 'none'
  },
  /**
   * @returns {boolean} returns true if it has something to do
   */
  _handleQueue() {
    if (Queue.waitingActions.length > 0) {
      const { type, content } = Queue.removeWaitingAction()
      if (type === 'close') {
        const { options, trigger, modal } = content
        if (Store.wasCloseAction === true) {
          Backdrop.remove()
        }
        Modal.close(modal, trigger, options)
      } else if (type === 'open') {
        const { modal, options, trigger } = content
        Modal.open(modal, trigger, options)
      } else {
        Log('error', 'Could not handle an action in queue. Action type "' + type + '" unknown.')
        return Modal._handleQueue()
      }
      return true
    }

    return false
  },
  _openHandler(e) {
    // just open a new modal if the target is correct regarding modal element
    if (this.className.indexOf(Elements.modalClass) !== -1) {
      if (e.target !== this) return
    }
    if (e.type === EventHelper.events.removeListener.type) {
      // will be removed in open if necessary
      if (this.className.indexOf(Elements.modalClass) !== -1) {
        return
      }
      EventHelper.removeListener(this, Modal._openHandler, 'open')
      return
    }

    const modalToOpenId = this.getAttribute('data-modal-id')
    const buttonOptions = this.getAttribute('data-modal-options')

    const modalToOpen = document.getElementById(modalToOpenId)
    if (modalToOpen === null) {
      Log('error', 'Could not find modal to open.')
      return
    }

    const modalOptions = modalToOpen.getAttribute('data-options')

    Modal.open(modalToOpen, this, [ modalOptions, buttonOptions ])
  },
  _closeHandler(e) {
    // prevent closing by click on modal content
    if (e.target !== this) return

    if (e.type === EventHelper.events.removeListener.type) {
      EventHelper.removeListener(this, Modal._closeHandler, 'close')
      return
    }

    const dataModalToClose = this.getAttribute('data-modal-to-close')
    const modalToClose =
      dataModalToClose !== '' && dataModalToClose !== null ? document.getElementById(dataModalToClose) : null

    Modal.close(modalToClose, this)
  },
  _customOpenHandler(modalToOpen, options) {
    // eslint-disable-next-line func-names
    const customOpenHandler = function(e) {
      if (e.type === EventHelper.events.removeListener.type) {
        EventHelper.removeListener(this, customOpenHandler, 'open')
        return
      }

      const buttonOptions = this.getAttribute('data-modal-options')
      const modalOptions = modalToOpen.getAttribute('data-options')

      Modal.open(modalToOpen, this, [ modalOptions, buttonOptions, options ])
    }
    return customOpenHandler
  },

  addCustomOpenHandler(element, modalToOpen, options) {
    EventHelper.addListener(element, this._customOpenHandler(modalToOpen, options), 'open')
  },
  addCloseHandler(element) {
    EventHelper.addListener(element, this._closeHandler, 'close')
  },
  addCloseHandlers(elements) {
    EventHelper.addListeners(elements, this._closeHandler, 'close')
  },
  addOpenHandler(element) {
    EventHelper.addListener(element, this._openHandler, 'open')
  },
  addOpenHandlers(elements) {
    EventHelper.addListeners(elements, this._openHandler, 'open')
  },
  /**
   * Override default options.
   * @param {object} options
   */
  setDefaultOptions(options) {
    if (typeof options === 'undefined') {
      Log('error', 'Default options could not be changed. Given options are undefined.')
    }
    if (typeof options !== 'object') {
      Log('error', 'Default options could not be changed. Given options not an object.')
    }
    Store.defaultOptions = options
  },
  /**
   * Get a list of all open modal objects
   * @returns {array}
   */
  getOpenModals() {
    const modals = []
    for (let i = 0; i < Queue.openModals.length; i += 1) {
      modals.push(Queue.openModals[i].modal)
    }
    return modals
  },
  /**
   * Check if modal is open
   * @param {HTMLElement} modal 
   * @returns {boolean}
   */
  isOpen(modal) {
    if (typeof modal !== 'object' || modal === null) {
      Log('error', 'Can not check if modal is open. Given modal element is not valid.')
      return false
    }
    return Queue.isModalOpen(modal)
  },
  /**
   * @param {HTMLElement} triggerElement 
   * @returns 
   */
  removeButton(triggerElement) {
    if (triggerElement === null) {
      Log('error', 'Could not remove trigger. Trigger element not found.')
      return
    }
    EventHelper.dispatchRemove(triggerElement)
  },
  /**
   * Add an event listener to a element and/or assign it to a modal.
   * @param {HTMLElement} triggerElement
   * @param {HTMLElement|null} modalElement
   * @param {object} options
   */
  addButton(triggerElement, modalElement = null, options = null) {
    if (triggerElement === null) {
      Log('error', 'Could not set trigger destination. Trigger Element not found.')
      return
    }

    let modalToOpen = modalElement
    if (modalToOpen === null) {
      const dataModalId = triggerElement.getAttribute('data-modal-id')
      if (dataModalId !== null && dataModalId !== '') {
        modalToOpen = document.getElementById(dataModalId)
      }
    }

    if (modalToOpen === null) {
      Log('error', 'Could not set trigger destination. Modal not found.')
      return
    }

    const triggerOptions = triggerElement.getAttribute('data-modal-options')
    const modalOptions = modalToOpen.getAttribute('data-options')

    // remove old events if attached
    EventHelper.dispatchRemove(triggerElement)

    Modal.addCustomOpenHandler(triggerElement, modalToOpen, [ modalOptions, triggerOptions, options ])
  }
}

export default Modal
