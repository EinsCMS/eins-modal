import Store from './store'
import Queue from './queue'
import Elements from './elements'

const Scrollbar = {
  /**
   * Hide scrollbar to prevent animation bugs with it
   * @param {HTMLElement} modal 
   * @param {HTMLElement} modalContent 
   * @returns {object}
   */
  hide(modal, modalContent) {
    modal.style.display = 'block'
    modalContent.style.display = 'block' // need to be block for getComputedStyle

    const modalContentStyle = window.getComputedStyle(modalContent)
    const modalContentMarginRight = parseFloat(modalContentStyle.getPropertyValue('margin-right'))
    const modalContentMarginLeft = parseFloat(modalContentStyle.getPropertyValue('margin-left'))
    // const modalContentHeight = parseInt(modalContentStyle.getPropertyValue('height'), 10)
    const modalContentMarginTop = parseInt(modalContentStyle.getPropertyValue('margin-top'), 10)
    const modalContentMarginBottom = parseInt(modalContentStyle.getPropertyValue('margin-bottom'), 10)

    const modalStyle = window.getComputedStyle(modal)
    const modalPaddingLeft = parseFloat(modalStyle.getPropertyValue('padding-left'))
    const modalPaddingRight = parseFloat(modalStyle.getPropertyValue('padding-right'))

    const scrollbarGap =
      document.documentElement.clientWidth -
      (modalContentMarginRight +
        modalContentMarginLeft +
        modalContent.offsetWidth +
        modalPaddingLeft +
        modalPaddingRight)

    // if there is a scrollbar we add a padding to prevent flickering when hiding scrollbar
    if (scrollbarGap > 0) {
      modal.style.paddingRight = `${modalPaddingRight + scrollbarGap}px`
    }

    const contentHeight = modalContent.offsetHeight + modalContentMarginTop + modalContentMarginBottom

    // disable scrollbar to fix scrollbar bug on some animations
    if (contentHeight < document.getElementsByTagName('html')[0].clientHeight) {
      // modal.style.marginTop = '-' + modal.scrollTop + 'px'
      modal.style.overflow = 'visible'
    } else {
      modal.style.overflow = 'hidden'
    }
    // scroll to previous scroll position

    Store.paddingRight = modalPaddingRight
  },
  /**
   * Show scrollbar and restore previous state
   * @param {HTMLElement} modal 
   */
  show(modal) {
    modal.style.paddingRight = Store.paddingRight + 'px'
    // modal.style.marginTop = '0px'
    modal.style.overflow = 'auto'
    modal.style.height = 'auto'
  },
  // Hide scrollbar of previous modal
  hidePrevious() {
    if (Queue.openModals.length === 0) {
      return
    }
    const { modal } = Queue.openModal
    this.hide(modal, Elements.getModalContent(modal))
  },
  // Show scrollbar of next modal
  showNext() {
    if (Queue.openModals.length === 0) {
      return
    }
    const { modal, paddingRight } = Queue.openModal
    Store.paddingRight = paddingRight
    this.show(modal)
  }
}

export default Scrollbar
