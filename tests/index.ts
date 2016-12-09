import * as Immutable from 'immutable'
import {Action, createStore} from 'redux'
import {combineImmutableReducers} from '../src'

interface CustomAction extends Action {
  value?: number
}

describe('combineImmutableReducers', () => {
  it('returns a composite reducer that maps the state keys to given reducers', () => {
    const reducer = combineImmutableReducers({
      counter: (state = 0, action: Action) =>
        action.type === 'increment' ? state + 1 : state,
      stack: (state = Immutable.List<number>(), action: CustomAction) =>
        action.type === 'push' && action.value ? state.push(action.value) : state
    })

    const s1 = reducer(undefined as any, {type: 'increment'})
    expect(s1).toEqualImmutable(Immutable.fromJS({counter: 1, stack: []}))
    const s2 = reducer(s1, {type: 'push', value: 'a'})
    expect(s2).toEqualImmutable(Immutable.fromJS({counter: 1, stack: ['a']}))
  })
})
