const test = require('tap').test
const promwrap = require('../')

let fun = (x, cb) => {
  cb(null, x)
}

let unfun = (x, cb) => {
  // eslint-disable-next-line standard/no-callback-literal
  cb(x + 1)
}

let _module = {
  fun,
  unfun,
  prop: 'test'
}

test('test basics', t => {
  t.plan(5)
  let mod = promwrap(_module)
  t.same(mod.prop, 'test')
  t.same(_module.prop, 'test')
  return mod.fun('test1')
    .then(res => t.same(res, 'test1'))
    .then(() => mod.fun('test1'))
    .then(res => t.same(res, 'test1'))
    .then(() => promwrap(fun)('test2'))
    .then(res => t.same(res, 'test2'))
})

test('exclude', t => {
  t.plan(4)
  let mod = promwrap(_module, {exclude: 'unfun'})
  return mod.fun('test1')
    .then(res => t.same(res, 'test1'))
    .then(() => {
      t.same(mod.unfun(0, () => {}), void 0)
      t.same(mod.unfun(0, res => t.same(res, 1)))
    })
})

test('exclude many', t => {
  t.plan(2)
  let mod = promwrap(_module, {exclude: ['unfun', 'fun']})
  t.same(mod.fun(0, () => {}), void 0)
  t.same(mod.unfun(0, () => {}), void 0)
})

test('exclude main', t => {
  t.plan(2)
  let superfun = (cb) => { cb() }
  superfun.frog = (cb) => { cb(null, 'ribbit') }
  let mod = promwrap(superfun, {excludeMain: true})
  t.same(superfun(() => {}), void 0)
  return mod.frog().then(res => t.same(res, 'ribbit'))
})

test('Object.prototype builtins', t => {
  t.plan(1)
  let mod = promwrap(_module)
  t.same(_module.toString, mod.toString)
})

test('Function.prototype builtins', t => {
  t.plan(1)
  let superfun = (cb) => { cb() }
  let mod = promwrap(superfun, {excludeMain: true})
  t.same(superfun.call, mod.call)
})

test('own props only', t => {
  t.plan(2)
  class Foo {
    foo () {}
  }
  class Bar extends Foo {}
  const bar = new Bar()
  let wrappedBar = promwrap(bar, {own: true})
  t.ok(bar.foo)
  t.same(bar.foo, wrappedBar.foo)
})

test('inherited props', t => {
  t.plan(2)
  class Foo {
    foo () {}
  }
  class Bar extends Foo {}
  const bar = new Bar()
  let wrappedBar = promwrap(bar, {own: false})
  t.ok(bar.foo)
  t.notSame(bar.foo, wrappedBar.foo)
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

test('falsy props', t => {
  t.plan(1)
  let mod = promwrap(_module)
  _module.prop2 = false
  t.same(mod.prop2, false)
})
