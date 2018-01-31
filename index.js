const {promisify} = require('es6-promisify')

class PromiseModule {
  constructor (mod) {
    this.mod = mod
    this.cache = new Map()
  }
}

const handler = {
  get: (target, name) => {
    if (target.cache.has(name)) return target.cache.get(name)
    if (target.mod[name]) {
      let val
      if (typeof target.mod[name] === 'function') {
        val = (...args) => promisify(cb => target.mod[name](...args, cb))()
      } else {
        val = target.mod[name]
      }
      target.cache.set(name, val)
      return val
    }
  }
}

module.exports = mod => {
  if (typeof mod === 'function') return promisify(mod)
  let p = new PromiseModule(mod)
  return new Proxy(p, handler)
}
