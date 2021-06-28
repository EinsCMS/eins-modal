/**
 * Log something to the console if available.
 * @param {string} level log level, for example "error", "warn", "log", "info"
 * @param {string} message 
 */
export default (level, message) => {
  if (!window.console) {
    return
  }
  const { console } = window
  if (typeof console[level] === 'function') {
    console[level](message)
  }
}
