import {Iterable} from 'immutable'

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be an immutable structure.
 */
export default function isImmutable (obj) {
  return Iterable.isIterable(obj)
}
