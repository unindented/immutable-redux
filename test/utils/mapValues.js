import Immutable from 'immutable'
import mapValues from '../../src/utils/mapValues'

describe('mapValues', () => {
  it('should return immutable map with mapped values', () => {
    const test = {a: 'c', b: 'd'}
    const actual = mapValues(test, (val, key) => val + key)
    const expected = Immutable.fromJS({a: 'ca', b: 'db'})
    expect(actual).toEqualImmutable(expected)
  })
})
