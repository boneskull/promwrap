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

## API

### `promwrap(value<T>, {exclude: string[]|string, excludeMain: bool, own: bool}): T`

Promisify all function properties of `value`.  If `value` is a `Function`,
it will be promisified instead.  Members of `Object.prototype` are *not*
promisified.

Returns `value`, wrapped by a `Proxy`.

- If `exclude` is supplied, do not promisify this prop/list of props.
- If `excludeMain` is truthy and `value` is a `Function`, treat `value` like a
  plain `Object` and promisify its props instead of `value` itself.  In 
  addition, members of `Function.prototype` will *not* be promisified.
- If `own` is truthy, *only* promisify the `Object`'s "own" (in the 
  `Object.hasOwnProperty()` sense) props
