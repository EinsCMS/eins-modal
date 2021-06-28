export default {
  objectToString(object) {
    let objectString = ''
    const objectKeys = Object.keys(object)
    for (let i = 0; i < objectKeys.length; i += 1) {
      const objectKey = objectKeys[i]
      objectString += objectKey + ':' + object[objectKey] + ';'
    }
    return objectString
  },
  stringToObject(string) {
    const object = {}
    // example: "openTransition: transition.bounceIn; backdropClose: false;"
    const properties = string.split(';')
    for (let j = 0; j < properties.length; j += 1) {
      const property = properties[j].split(':')
      if (property.length === 2) {
        const [ propertyKey, propertyValue ] = property
        const keyTrimmed = propertyKey.replace(/^\s+|\s+$/g, '') // remove white spaces from key
        object[keyTrimmed] = propertyValue.replace(/^\s+|\s+$/g, '') // and value
      }
    }
    return object
  },
  mergeObjects(destination, source) {
    const newObject = { ...destination }
    const sourceKeys = Object.keys(source)
    for (let i = 0; i < sourceKeys.length; i += 1) {
      const sourceKey = sourceKeys[i]
      newObject[sourceKey] = source[sourceKey]
    }
    return newObject
  }
}
