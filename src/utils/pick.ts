/**
 * Picks key-value pairs from an object where values satisfy a predicate.
 *
 * @param {Object} obj The object to pick from.
 * @param {Function} fn The predicate the values must satisfy to be copied.
 * @returns {Object} The object with the values that satisfied the predicate.
 */
export default function pick (obj: {[key: string]: any}, fn: (val: any) => boolean) {
  return Object.keys(obj).reduce(
    (result: {[key: string]: any}, key: string) => {
      if (fn(obj[key])) {
        result[key] = obj[key]
      }
      return result
    },
    {}
  )
}
