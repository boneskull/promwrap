const {promisify} = require('es6-promisify')

const EXCLUDE_OBJECT_PROTOTYPE = Object.getOwnPropertyNames(Object.prototype)
const EXCLUDE_FUNCTION_PROTOTYPE = Object.getOwnPropertyNames(Function.prototype)

class PromiseModule {
  constructor (mod, exclude, own) {
    this.mod = mod
    this.cache = new Map()
    this.exclude = new Set(EXCLUDE_OBJECT_PROTOTYPE.concat(exclude))
    this.own = own
  }
}

const handler = {
  get: (target, name) => {
    if (target.cache.has(name)) return target.cache.get(name)
    if (target.exclude.has(name)) return target.mod[name]
    if ((target.own ? target.mod.hasOwnProperty(name) : name in target.mod) && typeof target.mod[name] === 'function') {
      let val = (...args) => promisify(cb => target.mod[name](...args, cb))()
      target.cache.set(name, val)
      return val
    }
    return target.mod[name]
  }
}

module.exports = (mod, {exclude = [], excludeMain = false, own = false} = {}) => {
  if (typeof mod === 'function') {
    if (excludeMain) {
      exclude = exclude.concat(EXCLUDE_FUNCTION_PROTOTYPE)
    } else {
      return promisify(mod)
    }
  }
  let p = new PromiseModule(mod, exclude, own)
  return new Proxy(p, handler)
}
