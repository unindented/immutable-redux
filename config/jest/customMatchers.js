const immutableMatchers = require('jest-immutable-matchers')

beforeEach(function () {
  jasmine.addMatchers(immutableMatchers)
})
