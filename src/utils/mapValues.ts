import {Map} from 'immutable'

/**
 * Applies a function to every key-value pair inside an object.
 *
 * @param {Object} obj The source object.
 * @param {Function} fn The mapper function that receives the value and the key.
 * @returns {Object} A new object that contains the mapped values for the keys.
 */
export default function mapValues (obj: {[key: string]: any}, fn: (val: any, key: string) => any) {
  return Object.keys(obj).reduce(
    (result: Map<string, any>, key: string) => (
      result.set(key, fn(obj[key], key))
    ),
    Map<string, any>()
  )
}
