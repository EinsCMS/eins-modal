import { addFillGapSelector } from 'scroll-lock'

import addModalFunction from './modal-function'
import Elements from './elements'
import Modal from './modal'

/**
 * Hide all modals on page load.
 * To prevent bugs on page reload.
 */
function hideModals() {
  const { modals } = Elements
  if (modals.length === 0) {
    return
  }
  // hide all modals
  for (let i = 0; i < modals.length; i += 1) {
    const modal = modals[i]
    modal.style.display = 'none'
  }
}

/**
 * Add click and touch events to all trigger buttons on page.
 */
function initButtons() {
  Modal.addOpenHandlers(Elements.buttons)
}

/**
 * Add the ".modal()" closure to all modal elements.
 */
function initModalClosures() {
  const { modals } = Elements
  if (modals.length === 0) {
    return
  }
  for (let i = 0; i < modals.length; i += 1) {
    const modal = modals[i]
    addModalFunction(modal)
  }
}

function fillScrollbarGap() {
  addFillGapSelector('.' + Elements.fillScrollbarGapClass)
}

const initializeElements = function() {
  hideModals()
  initButtons()
  initModalClosures()
  fillScrollbarGap()
}

export default initializeElements
