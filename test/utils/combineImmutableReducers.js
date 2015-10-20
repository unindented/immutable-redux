import Immutable, {List} from 'immutable'
import {createStore} from 'redux'
import combineImmutableReducers, {ActionTypes} from '../../src/utils/combineImmutableReducers'

describe('Utils', () => {
  describe('combineImmutableReducers', () => {
    it('should return a composite reducer that maps the state keys to given reducers', () => {
      const reducer = combineImmutableReducers({
        counter: (state = 0, action) =>
          action.type === 'increment' ? state + 1 : state,
        stack: (state = List(), action) =>
          action.type === 'push' ? state.push(action.value) : state
      })

      const s1 = reducer(undefined, {type: 'increment'})
      expect(s1).toEqualImmutable(Immutable.fromJS({counter: 1, stack: []}))
      const s2 = reducer(s1, {type: 'push', value: 'a'})
      expect(s2).toEqualImmutable(Immutable.fromJS({counter: 1, stack: ['a']}))
    })

    it('ignores all props which are not a function', () => {
      const reducer = combineImmutableReducers({
        fake: true,
        broken: 'string',
        another: {nested: 'object'},
        stack: (state = List()) => state
      })

      expect(
        reducer(undefined, {type: 'push'}).keySeq().toArray()
      ).toEqual(['stack'])
    })

    it('should throw an error if a reducer returns undefined handling an action', () => {
      const reducer = combineImmutableReducers({
        counter (state = 0, action) {
          switch (action && action.type) {
            case 'increment':
              return state + 1
            case 'decrement':
              return state - 1
            case 'whatever':
            case null:
            case undefined:
              return undefined
            default:
              return state
          }
        }
      })

      expect(
        () => reducer(Immutable.fromJS({counter: 0}), {type: 'whatever'})
      ).toThrowError(
        /"counter".*"whatever"/
      )
      expect(
        () => reducer(Immutable.fromJS({counter: 0}), null)
      ).toThrowError(
        /"counter".*an action/
      )
      expect(
        () => reducer(Immutable.fromJS({counter: 0}), {})
      ).toThrowError(
        /"counter".*an action/
      )
    })

    it('should throw an error on first call if a reducer returns undefined initializing', () => {
      const reducer = combineImmutableReducers({
        counter (state, action) {
          switch (action.type) {
            case 'increment':
              return state + 1
            case 'decrement':
              return state - 1
            default:
              return state
          }
        }
      })
      expect(() => reducer()).toThrowError(
        /"counter".*initialization/
      )
    })

    it('should catch error thrown in reducer when initializing and re-throw', () => {
      const reducer = combineImmutableReducers({
        throwingReducer () {
          throw new Error('Error thrown in reducer')
        }
      })
      expect(() => reducer()).toThrowError(
        /Error thrown in reducer/
      )
    })

    it('should allow a symbol to be used as an action type', () => {
      const increment = Symbol('INCREMENT')

      const reducer = combineImmutableReducers({
        counter (state = 0, action) {
          switch (action.type) {
            case increment:
              return state + 1
            default:
              return state
          }
        }
      })

      expect(
        reducer(Immutable.fromJS({counter: 0}), {type: increment}).get('counter')
      ).toEqual(1)
    })

    it('should maintain referential equality if the reducers it is combining do', () => {
      const reducer = combineImmutableReducers({
        child1 (state = {}) {
          return state
        },
        child2 (state = {}) {
          return state
        },
        child3 (state = {}) {
          return state
        }
      })

      const initialState = reducer(undefined, '@@INIT')
      expect(reducer(initialState, {type: 'FOO'})).toBe(initialState)
    })

    it('should not have referential equality if one of the reducers changes something', () => {
      const reducer = combineImmutableReducers({
        child1 (state = {}) {
          return state
        },
        child2 (state = {count: 0}, action) {
          switch (action.type) {
            case 'increment':
              return {count: state.count + 1}
            default:
              return state
          }
        },
        child3 (state = {}) {
          return state
        }
      })

      const initialState = reducer(undefined, '@@INIT')
      expect(reducer(initialState, {type: 'increment'})).not.toBe(initialState)
    })

    it('should throw an error on first call if a reducer attempts to handle a private action', () => {
      const reducer = combineImmutableReducers({
        counter (state, action) {
          switch (action.type) {
            case 'increment':
              return state + 1
            case 'decrement':
              return state - 1
            // Never do this in your code:
            case ActionTypes.INIT:
              return 0
            default:
              return undefined
          }
        }
      })
      expect(() => reducer()).toThrowError(
        /"counter".*private/
      )
    })

    it('should warn if no reducers are passed to combineImmutableReducers', () => {
      const spy = spyOn(console, 'error')
      const reducer = combineImmutableReducers({})
      reducer()
      expect(spy.calls.argsFor(0)[0]).toMatch(
        /Store does not have a valid reducer/
      )
    })

    it('should warn if input state object does not match state object returned by reducer', () => {
      const spy = spyOn(console, 'error')
      const reducer = combineImmutableReducers({
        foo (state = Immutable.fromJS({bar: 1})) {
          return state
        },
        baz (state = Immutable.fromJS({qux: 3})) {
          return state
        }
      })

      reducer(Immutable.fromJS({foo: {bar: 2}}))
      expect(spy.calls.count()).toBe(0)

      reducer(Immutable.fromJS({foo: {bar: 2}, baz: {qux: 4}}))
      expect(spy.calls.count()).toBe(0)

      createStore(reducer, Immutable.fromJS({bar: 2}))
      expect(spy.calls.argsFor(0)[0]).toMatch(
        /Unexpected key "bar".*createStore.*instead: "foo", "baz"/
      )

      createStore(reducer, Immutable.fromJS({bar: 2, qux: 4}))
      expect(spy.calls.argsFor(1)[0]).toMatch(
        /Unexpected keys "bar", "qux".*createStore.*instead: "foo", "baz"/
      )

      createStore(reducer, 1)
      expect(spy.calls.argsFor(2)[0]).toMatch(
        /createStore has unexpected type of "Number".*keys: "foo", "baz"/
      )

      reducer(Immutable.fromJS({bar: 2}))
      expect(spy.calls.argsFor(3)[0]).toMatch(
        /Unexpected key "bar".*reducer.*instead: "foo", "baz"/
      )

      reducer(Immutable.fromJS({bar: 2, qux: 4}))
      expect(spy.calls.argsFor(4)[0]).toMatch(
        /Unexpected keys "bar", "qux".*reducer.*instead: "foo", "baz"/
      )

      reducer(1)
      expect(spy.calls.argsFor(5)[0]).toMatch(
        /reducer has unexpected type of "Number".*keys: "foo", "baz"/
      )
    })
  })
})
