/**
 * @public
 * @function deepFreeze
 * @description Deep freeze object.
 * @param {Object} object - Object to deep freeze.
 * @returns {Object} - Deep frozen object.
 */

export function deepFreeze(object) {
  if (object) {
    let property, propertyKey;
    object = Object.freeze(object);
    for (propertyKey in object) {
      if (object.hasOwnProperty(propertyKey)) {
        property = object[propertyKey];
        if (
          typeof property !== 'object' ||
          !(property instanceof Object) ||
          Object.isFrozen(property)
        ) {
          continue;
        }
        deepFreeze(property);
      }
    }
  }
  return object;
}
