import {fromJS} from 'immutable'
import mapValues from '../../src/utils/mapValues'

describe('mapValues', () => {
  it('returns immutable map with mapped values', () => {
    const test = {a: 'c', b: 'd'}
    const actual = mapValues(test, (val, key) => val + key)
    const expected = fromJS({a: 'ca', b: 'db'})
    expect(actual).toEqualImmutable(expected)
  })
})
