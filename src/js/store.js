import ObjectHelper from './object-helper'

export default {
  _paddingRight: null,
  /**
   * @return {number|null} right padding of modal
   */
  get paddingRight() {
    return this._paddingRight
  },
  /**
   * @param {number|null} value right padding of modal
   */
  set paddingRight(value) {
    this._paddingRight = value
  },

  _trigger: null,
  /**
   * @return {HTMLElement|null}
   */
  get trigger() {
    return this._trigger
  },
  /**
   * @param {HTMLElement|null} trigger
   */
  set trigger(trigger) {
    this._trigger = trigger
  },

  _modalToOpen: null,
  /**
   * @return {HTMLElement|null}
   */
  get modalToOpen() {
    return this._modalToOpen
  },
  /**
   * @param {HTMLElement|null} modal
   */
  set modalToOpen(modal) {
    this._modalToOpen = modal
  },

  _modalToClose: null,
  /**
   * @return {HTMLElement|null}
   */
  get modalToClose() {
    return this._modalToClose
  },
  /**
   * @param {HTMLElement|null} modal
   */
  set modalToClose(modal) {
    this._modalToClose = modal
  },

  _wasCloseAction: false,
  get wasCloseAction() {
    return this._isCloseAction
  },
  set wasCloseAction(value) {
    this._isCloseAction = value
  },

  _backdrop: null,
  get backdrop() {
    return this._backdrop
  },
  set backdrop(value) {
    this._backdrop = value
  },

  _backdropToRemove: null,
  get backdropToRemove() {
    return this._backdropToRemove
  },
  set backdropToRemove(value) {
    this._backdropToRemove = value
  },

  _processing: false,
  get processing() {
    return this._processing
  },
  set processing(value) {
    this._processing = value
  },

  _defaultOptions: {
    openTransition: 'bounceIn',
    openDuration: 400,
    closeTransition: 'expandOut',
    closeDuration: 200,
    backdropClose: 'true',
    multiple: 'true',
    wait: 'false'
  },
  get defaultOptions() {
    return this._defaultOptions
  },
  set defaultOptions(value) {
    this._defaultOptions = ObjectHelper.mergeObjects(this.defaultOptions, value)
  },

  _options: null,
  get options() {
    return this._options === null ? this.defaultOptions : this._options
  },
  set options(options) {
    const optionsArray = !Array.isArray(options) ? [ options ] : options

    let mergedOptions = { ...this.defaultOptions }

    for (let i = 0; i < optionsArray.length; i += 1) {
      const option =
        typeof optionsArray[i] === 'string' ? ObjectHelper.stringToObject(optionsArray[i]) : optionsArray[i]

      if (typeof option === 'object' && option !== null) {
        mergedOptions = ObjectHelper.mergeObjects(mergedOptions, option)
      }
    }

    this._options = mergedOptions
  },

  optionsEqualDefaultOptions() {
    const defaultKeys = Object.keys(this.defaultOptions)
    const optionKeys = Object.keys(this.options)
    for (let i = 0; i < defaultKeys.length; i += 1) {
      const defaultKey = defaultKeys[i]
      if (typeof this.options[defaultKey] === 'undefined') {
        return false
      }
      if (this.options[defaultKey] !== this.defaultOptions[defaultKey]) {
        return false
      }
    }

    for (let i = 0; i < optionKeys.length; i += 1) {
      const optionKey = optionKeys[i]
      if (typeof this.defaultOptions[optionKey] === 'undefined') {
        return false
      }
      if (this.defaultOptions[optionKey] !== this.options[optionKey]) {
        return false
      }
    }

    return true
  },
  reset() {
    this.paddingRight = null
    this.trigger = null
    this.modalToOpen = null
    this.modalToClose = null
    this.wasCloseAction = false
    this.backdrop = null
    this.processing = false
    this._options = null
  },
  resetOpen() {
    this.paddingRight = null
  }
}
