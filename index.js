const promisify = require('util').promisify

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
        val = async (...args) => {
          return promisify(cb => target.mod[name](...args, cb))()
        }
      } else {
        val = target.mod[name]
      }
      target.cache.set(name, val)
      return val
    }
    throw new Error(`Module has no property named ${name}`)
  }
}

module.exports = mod => {
  if (typeof mod === 'function') return promisify(mod)
  let p = new PromiseModule(mod)
  return new Proxy(p, handler)
}
