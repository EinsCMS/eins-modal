import Log from './log'
import Store from './store'

const Elements = {
  _modalClass: 'eins-modal',
  get modalClass() {
    return this._modalClass
  },
  set modalClass(value) {
    this._modalClass = value
  },

  _classSuffixes: {
    backdrop: '-backdrop',
    content: '-content',
    closeButton: '-close-button',
    closeIcon: '-close'
  },
  get classSuffixes() {
    return this._classSuffixes
  },

  fillScrollbarGapClass: 'fill-scrollbar-gap',

  getClass(classSuffixKey) {
    if (typeof this.classSuffixes[classSuffixKey] === 'undefined') {
      Log('error', 'Class suffix key does not exist!')
      return null
    }
    return this.modalClass + this.classSuffixes[classSuffixKey]
  },

  get buttons() {
    const allButtons = document.querySelectorAll('[data-modal-id]')
    const buttonsInModal = document.querySelectorAll('.' + this.modalClass + ' [data-modal-id]')
    const buttonsThatAreModals = document.querySelectorAll('.' + this.modalClass + '[data-modal-id]')
    if (allButtons.length === 0 || (buttonsInModal.length === 0 && buttonsThatAreModals.length === 0)) {
      return allButtons
    }
    const buttons = []
    for (let i = 0; i < allButtons.length; i += 1) {
      let isNormalButton = true
      const button = allButtons[i]
      for (let j = 0; j < buttonsInModal.length; j += 1) {
        const buttonInModal = buttonsInModal[j]
        if (buttonInModal === button) {
          isNormalButton = false
          break
        }
      }
      for (let j = 0; j < buttonsThatAreModals.length; j += 1) {
        const buttonThatIsModal = buttonsThatAreModals[j]
        if (buttonThatIsModal === button) {
          isNormalButton = false
          break
        }
      }
      if (isNormalButton === true) {
        buttons.push(button)
      }
    }
    return buttons
  },

  get modals() {
    return document.getElementsByClassName(this.modalClass)
  },
  /**
   * Retrieve the modal-content element of current modal.
   * @returns {HTMLElement|null}
   */
  get modalContent() {
    if (Store.modalToOpen === null) {
      return null
    }
    const modalContent = Store.modalToOpen.querySelectorAll('.' + this.getClass('content'))
    if (modalContent.length > 0) {
      return modalContent[0]
    }
    return null
  },
  /**
   * Retrieve the modal-content element of given modal.
   * @param {HTMLElement} modal modal element
   * @returns {HTMLElement|null}
   */
  getModalContent(modal) {
    if (modal === null) {
      return null
    }
    const modalContent = modal.querySelectorAll('.' + this.getClass('content'))
    if (modalContent.length > 0) {
      return modalContent[0]
    }
    return null
  },
  get closeButtons() {
    return Store.modalToOpen.querySelectorAll('.' + this.getClass('closeButton'))
  },
  get closeIcons() {
    return Store.modalToOpen.querySelectorAll('.' + this.getClass('closeIcon'))
  },
  get openButtonsInModal() {
    return Store.modalToOpen.querySelectorAll('[data-modal-id]')
  },
  get body() {
    return document.getElementsByTagName('body')[0]
  },
  get backdrops() {
    return document.getElementsByClassName(this.getClass('backdrop'))
  },
  get lastBackdrop() {
    return document.querySelector('.' + this.getClass('backdrop') + ':last-child')
  },
  createBackdropElement() {
    const backdropElement = document.createElement('div')
    backdropElement.className += this.getClass('backdrop')
    return backdropElement
  }
}

export default Elements
