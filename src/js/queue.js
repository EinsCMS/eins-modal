import Store from './store'

export default {
  _openModals: [],
  /**
   * @var {[object]} openModals containing modal, options, backdrop.
   */
  get openModals() {
    return this._openModals
  },
  /**
   * @param {object} modalObject containing modal, options, backdrop.
   */
  set openModals(modalObject) {
    this.openModals.push(modalObject)
  },

  _waitingActions: [],
  /**
   * There are two types of actions: open and close.
   * An open action contains a type and content object containing modal, options and trigger attributes.
   * An close action contains a type and content object containing modal, options and trigger attributes.
   * @return {[object]} an array with all action objects, they have a type and an content object.
   */
  get waitingActions() {
    return this._waitingActions
  },
  /**
   * @param {object} action object that has a type and a content object.
   */
  set waitingActions(action) {
    // prevent multiple clicks
    if (this.hasWaitingAction(action)) {
      return
    }
    this.waitingActions.push(action)
  },
  set nextAction(action) {
    this.waitingActions.unshift(action)
  },

  /**
   * @return {object|null} last opened modal object containing modal, options, backdrop.
   */
  get openModal() {
    if (this.openModals.length === 0) {
      return null
    }
    return this.openModals[this.openModals.length - 1]
  },

  /**
   * @param {number} position beginning by 0
   */
  getOpenModal(position) {
    if (position < 0 || this.openModals.length < position) {
      return null
    }
    return this.openModals[this.openModals.length - 1 - position]
  },

  removeOpenModal() {
    if (this.openModals.length === 0) {
      return null
    }

    const { modalToClose } = Store

    if (modalToClose !== null && typeof modalToClose === 'object') {
      if (!this.isModalOpen(modalToClose)) {
        // Queue.openModals = currentOpenModalObject
        Store.processing = false
        return null
      }

      const modalObjKeys = Object.keys(this.openModals)
      for (let i = 0; i < modalObjKeys.length; i += 1) {
        const modalObjKey = modalObjKeys[i]
        if (this.openModals[modalObjKey].modal === modalToClose) {
          const { options, backdrop } = this.openModals[modalObjKey]
          this.openModals.splice(i, 1)
          Store.options = Store.optionsEqualDefaultOptions() ? options : [ options, Store.options ]
          Store.backdrop = backdrop
          return modalToClose
        }
      }
      return null
    }

    const { modal, options, backdrop } = this.openModals.pop()
    Store.options = Store.optionsEqualDefaultOptions() ? options : [ options, Store.options ]
    Store.backdrop = backdrop
    return modal
  },

  removeWaitingAction() {
    return this.waitingActions.shift()
  },
  isModalOpen(modal) {
    return this.openModals.length === null ? false : this.openModals.some((modalObject) => modalObject.modal === modal)
  },
  hasWaitingAction(newWaitingAction) {
    return this.waitingActions.length === null
      ? false
      : this.waitingActions.some(
          (waitingAction) =>
            waitingAction.type === newWaitingAction.type &&
            waitingAction.content.modal === newWaitingAction.content.modal &&
            waitingAction.content.trigger === newWaitingAction.content.trigger
        )
  }
}
