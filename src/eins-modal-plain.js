// initialize all elements
import initializeElements from './js/plain/initialize-elements'

import Log from './js/log'
import EventHelper from './js/event-helper'
import Modal from './js/plain/modal'
import addModalFunction from './js/plain/modal-function'

const EinsModal = {
  /**
   * Open a modal.
   * @param {HTMLElement|string} modalToOpen
   * @param {object|null} options
   * @param {HTMLElement|null} trigger
   */
  open(modalElementOrId, options = null) {
    const modalToOpen =
      typeof modalElementOrId === 'string' ? document.getElementById(modalElementOrId) : modalElementOrId
    if (modalToOpen === null) {
      Log('error', 'No modal found to open.')
      return
    }
    const modalOptions = modalToOpen.getAttribute('data-options')
    Modal.open(modalToOpen, null, [ modalOptions, options ])
  },
  /**
   * Close a modal.
   * @param {HTMLElement|string|null} modalToOpen close a specific modal, not the last opened
   * @param {HTMLElement|null} trigger
   * @param {object|null} options
   */
  close(modalElementOrId = null, options = null) {
    const modalToClose =
      typeof modalElementOrId === 'string' ? document.getElementById(modalElementOrId) : modalElementOrId
    const modalOptions = modalToClose !== null ? modalToClose.getAttribute('data-options') : null
    Modal.close(modalToClose, null, [ modalOptions, options ])
  },
  /**
   * Override default options.
   * @param {object} options 
   */
  setDefaultOptions(options) {
    Modal.setDefaultOptions(options)
  },
  /**
   * Get a list of all open modal objects
   * @returns {array}
   */
  getOpenModals() {
    return Modal.getOpenModals()
  },
  /**
   * Check if modal is open
   * @param {HTMLElement|string} modalElementOrId
   * @returns {boolean}
   */
  isOpen(modalElementOrId) {
    const modal = typeof modalElementOrId === 'string' ? document.getElementById(modalElementOrId) : modalElementOrId
    return Modal.isOpen(modal)
  },
  /**
   * Add an event listener to a element and/or assign it to a modal.
   * @param {string|HTMLElement} triggerElementOrId 
   * @param {string|HTMLElement|null} modalElementOrId 
   * @param {object} options
   */
  addButton(triggerElementOrId, modalElementOrId = null, options = null) {
    const triggerElement =
      typeof triggerElementOrId === 'string' ? document.getElementById(triggerElementOrId) : triggerElementOrId
    const modalToOpen =
      typeof modalElementOrId === 'string' ? document.getElementById(modalElementOrId) : modalElementOrId

    Modal.addButton(triggerElement, modalToOpen, options)
  },
  /**
   * Remove all event listeners from an element.
   * @param {HTMLElement|string} triggerElementOrId 
   */
  removeButton(triggerElementOrId) {
    const triggerElement =
      typeof triggerElementOrId === 'string' ? document.getElementById(triggerElementOrId) : triggerElementOrId
    Modal.removeButton(triggerElement)
  },
  /**
   * Add ".modal()" function to a modal
   * @param {string|HTMLElement} modalElementOrId 
   */
  addModalFunction(modalElementOrId) {
    const modalElement =
      typeof modalElementOrId === 'string' ? document.getElementById(modalElementOrId) : modalElementOrId
    return addModalFunction(modalElement)
  }
}

window.addEventListener('load', () => {
  initializeElements()
  window.einsModal = EinsModal
  EventHelper.dispatchGlobal()
})

export default EinsModal
