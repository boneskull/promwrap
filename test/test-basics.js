const test = require('tap').test
const promwrap = require('../')

let fun = (x, cb) => cb(null, x)
let _module = {fun, prop: 'test'}

test('test basics', t => {
  t.plan(4)
  let mod = promwrap(_module)
  t.same(mod.prop, 'test')
  t.same(mod.prop, 'test')
  return Promise.all([
    mod.fun('test1').then(res => t.same(res, 'test1')),
    promwrap(fun)('test2').then(res => t.same(res, 'test2'))
  ])
})

test('unknown property', t => {
  t.plan(2)
  t.same(_module.foo, void 0)
  let mod = promwrap(_module)
  t.same(mod.foo, void 0)
})

test('unknown function', t => {
  t.plan(2)
  t.throws(() => _module.foo())
  let mod = promwrap(_module)
  t.throws(() => mod.foo())
})
