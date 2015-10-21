import immutableMatchers from 'jasmine-immutable-matchers'

beforeEach(function () {
  jasmine.addMatchers(immutableMatchers)
})

const testContext = require.context('./test', true, /.*\.js$/)
testContext.keys().forEach(testContext)
