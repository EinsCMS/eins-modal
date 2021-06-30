import Log from '../log'
import Queue from '../queue'
import Modal from './modal'

const closure = function(methodName, options = null) {
  const dataOptions = this.getAttribute('data-options')
  switch (methodName) {
    case 'show':
      Modal.open(this, null, [ dataOptions, options ])
      break
    case 'hide':
      Modal.close(this, null, [ dataOptions, options ])
      break
    case 'toggle':
      if (Queue.isModalOpen(this) === true) {
        Modal.close(this, null, [ dataOptions, options ])
      } else {
        Modal.open(this, null, [ dataOptions, options ])
      }
      break
    default:
      Log('error', 'Method "' + methodName + '" not allowed.')
      break
  }
}

/**
 * Add the ".modal()" closure to one element.
 * @param {HTMLElement} element modal element.
 * @return {boolean}
 */
const addModalFunction = function(element) {
  if (typeof element !== 'object' || element === null) {
    return false
  }

  element.modal = closure

  return true
}

export default addModalFunction
