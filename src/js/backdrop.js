import Store from './store'
import Elements from './elements'

const Backdrop = {
  /**
   * Creates backdrop element and adds it to the body element.
   * Sets modal z-index and backdrop element in store.
   */
  create() {
    const removeOldBackdrop = Store.wasCloseAction === true

    const zIndexIncrement = 100
    const zIndexDiffToModal = 1

    // create and insert backdrop to body
    const newBackdrop = Elements.createBackdropElement()

    const { body } = Elements

    // attach backdrop to body
    body.appendChild(newBackdrop)

    if (removeOldBackdrop === true && Store.backdrop.parentNode === body) {
      Store.backdrop.style.display = 'none'
      body.removeChild(Store.backdrop)
    }

    Store.backdrop = newBackdrop

    // without display = 'block' window.getComputedStyle will not work
    newBackdrop.style.visibility = 'hidden'
    newBackdrop.style.display = 'block'

    const backdropStyle = window.getComputedStyle(newBackdrop)
    let zIndex = parseInt(backdropStyle.getPropertyValue('z-index'), 10)
    newBackdrop.style.zIndex = zIndex

    newBackdrop.style.display = 'none'
    newBackdrop.style.visibility = 'visible'

    const { backdrops } = Elements
    if (backdrops.length > 1) {
      // we need to take make -2 because we added the new backdrop above
      zIndex = parseInt(backdrops[backdrops.length - 2].style.zIndex, 10) + zIndexIncrement
      newBackdrop.style.zIndex = zIndex
    }

    Store.modalToOpen.style.zIndex = zIndex + zIndexDiffToModal

    // to open a new modal
    const dataModalId = Store.modalToOpen.getAttribute('data-modal-id')
    if (dataModalId !== null && dataModalId !== '') {
      newBackdrop.setAttribute('data-modal-id', dataModalId)
      const dataModalOptions = Store.modalToOpen.getAttribute('data-modal-options')
      if (dataModalOptions !== null && dataModalOptions !== '') {
        newBackdrop.setAttribute('data-modal-options', dataModalOptions)
      }
    }
  },
  remove() {
    if (Store.backdrop !== null && Store.backdrop.parentNode === Elements.body) {
      Elements.body.removeChild(Store.backdrop)
    }
    const { lastBackdrop } = Elements
    if (lastBackdrop !== null) {
      lastBackdrop.style.display = 'block'
    }
  },
  show() {
    const { backdrops } = Elements
    if (backdrops.length > 1) {
      backdrops[backdrops.length - 2].style.display = 'none'
    }
    Store.backdrop.style.display = 'block'
  }
}

export default Backdrop
