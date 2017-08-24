# promwrap

Wraps modules, and other objects, full of callback functions in promises.

```javascript
let fun = (x, cb) => cb(null, x)
let _module = {fun, prop: 'test'}

test('test basics', async t => {
  t.plan(4)
  let mod = promwrap(_module)
  t.same(mod.prop, 'test')
  t.same(mod.prop, 'test')
  t.same(await mod.fun('test1'), 'test1')
  t.same(await promwrap(fun)('test2'), 'test2')
})
```