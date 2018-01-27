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

test('test error', t => {
  t.plan(2)
  try {
    console.log(promwrap(_module).notfound)
  } catch (e) {
    t.type(e, 'Error')
    t.type(e.message, (`Module has no property named notfound`))
  }
})
