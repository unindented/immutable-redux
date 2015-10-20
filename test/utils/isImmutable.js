import {List, Map} from 'immutable'
import isImmutable from '../../src/utils/isImmutable'

describe('isImmutable', () => {
  it('should return true only if immutable structure', () => {
    expect(isImmutable()).toBe(false)
    expect(isImmutable(null)).toBe(false)
    expect(isImmutable([])).toBe(false)
    expect(isImmutable({})).toBe(false)
    expect(isImmutable(List())).toBe(true)
    expect(isImmutable(Map())).toBe(true)
  })
})
