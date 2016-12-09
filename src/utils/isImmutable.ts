import {Iterable} from 'immutable'

/**
 * Checks whether something is an immutable structure.
 *
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be an immutable structure.
 */
export default function isImmutable (obj?: any) {
  return Iterable.isIterable(obj)
}
