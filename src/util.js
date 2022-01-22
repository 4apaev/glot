import is, { T, Fail, assert, raise, deny } from './is.js'

export const µ = null
export const A = Array
export const S = String
export const O = Object
export { is, T, Fail, assert, raise, deny }

export function def() {
  let [[ c, e, w ], [ a, b ]] = T.args.binary(arguments)
  for (let k in b = O.getOwnPropertyDescriptors(b)) {
    (b[ k ].get ?? (
      w != µ && (b[ k ].writable = w)))
    e != µ && (b[ k ].enumerable = e)
    c != µ && (b[ k ].configurable = c)
  }

  return O.defineProperties(a, b)
}

export function use(a, b) {
  return def(a, b, 1, 0, 1)
}

use(O, {
  get o() { return O.create(µ) },
  def,   use,
  set,   mix,
  each,  from,
  alias, aliasGet,
})

def.each = useEach
use.each = useEach

export function useEach(...a) {
  return (fn, ...b) => {
    a.forEach(is.f(fn)
      ? x => fn(x, ...b)
      : x => def(x, fn, ...b))
  }
}

export function mix(...a) {
  return O.assign(O.o, ...a)
}

export function get(a, b) {
  return b
    ? O.getOwnPropertyDescriptor(a, b)
    : O.getOwnPropertyDescriptors(a)
}

export function set(o, n, v, c, e) {
  let d = {
    get() { return v },
    configurable: !!c,
    enumerable: !!e,
  }
  c && (d.set = x => v = x)
  return O.defineProperty(o, n, d)
}

export function from(x)  {
  return is.I(x)
    ? O.fromEntries(x?.entries?.() ?? A.from(x, (v, i) => [ i, v ]))
    : O.entries(x)
}

export function alias() {
  let [[ c, ...d ], [ a, b = a ]] = T.args.binary(arguments)
  let ds = get(a, c)
  for (let x of d)
    O.defineProperty(b, x, ds)
  return b
}

export function aliasGet(a, b, c, ...d) {
  return use(a, {
    get [ c ]() {
      return this[ b ](...d)
    },
    set [ c ](x) {
      this[ b ].apply(this, [].concat(x))
    },
  })
}

export function each(it, cb, prev) {
  const stop = Symbol('📛')
  for (let [ k, v ] of it?.entries?.() ?? O.entries(it)) {
    prev = cb(v, k, prev, stop)
    if (prev === stop) break
  }
  return prev
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function az(a, b) {
  a === +a || (a = a.codePointAt())
  b != µ
    ? (b === +b || (b = b.codePointAt()))
    : (a + 32)
  b > a || ([ a, b ] = [ b, a ])
  return A.range(a, b, S.point)
}

tmpl.raw = (s, ...a) => tmpl(s, a).join('')
export function tmpl(s, a, cb = x => x) {
  for (var i = 0, re = [ s.raw[ i ] ]; i < a.length;)
    re = re.concat(cb(a[ i++ ]), s.raw[ i ])
  return re
}


export function fill(i, cb = x => x) {
  return A.from({ length: i }, (_, i) => cb(i))
}

export function range(start, end, step = 1) {
  return A.fill(1 + end - start, is.f(step)
    ? i => step(start + i)
    : _ => start += step)
}

export function invoke(it, fn, ...a) {
  return it.map(is.f(fn)
    ? x => fn.apply(x, a)
    : x => x[ fn ].apply(x, a))
}

export function chop(it, cb, ctx) {
  is.n(cb) && (cb = (n => (x, i) => 0 === i % n)(cb))
  for (var tmp, re = [], i = 0; i < it.length; i++) {
    cb.call(ctx, it[ i ], i) && re.push(tmp = [])
    tmp.push(it[ i ])
  }
  return re
}

export function where(it, cb, ctx) {
  cb = predict(cb)
  for (var re = [], i = it.length; i--;)
    cb.call(ctx, it[ i ], i, it) && re.unshift(it[ i ])
  return re
}

export function remove(it, x, ctx) {
  for (var j = 0, i = 0, re = [], cb = predict(x); i < it.length; i++) {
    cb.call(ctx, it[ i ], i, it)
      ? re.push(it[ i ])
      : it[ j++ ] = it[ i ]
  }
  it.length = j
  return re
}

function predict(x) {
  return is.f(x)
    ? x
    : (kk => o => kk.every(k => o[ k ] === x[ k ]))(O.keys(x))
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

use(S, { az })
use(A, { fill, range, invoke, chop, where, remove })

use(A.prototype, {
  get uniqe() {
    return A.from(new Set(this))
  },
})

use(S.prototype, {
  get log() {
    return console.log(this.valueOf())
  },

  rx(fl = '') {
    return new RegExp(this.replace(/( +)?\n+( +)?/g, ''), fl)
  },

  where(rx, cb = x => x) { return A.from(this.matchAll(rx), x => cb(x.groups ?? x)) },

  justify(n) {
    return this.replace(`
      (?![^\n]{1,${ n }}$)
      ([^\n]{1,${ n }})\s
    `.rx.g, '$1\n')
  },


  pad(n, x = ' ') {
    let fl = 0
    let s = S(this)
    while (n > s.length) {
      fl ^= 1
      s = fl
        ? s + x
        : x + s
    }
    return s
  },
})

use(RegExp.prototype, {
  clone(fl) {
    return new RegExp(this.source, fl ?? this.flags)
  },
})

alias(A.prototype,  'includes', 'has')
alias(A.prototype,  'forEach', 'each')
alias(Map.prototype, 'forEach', 'each')
alias(Set.prototype, 'forEach', 'each')
alias(A.prototype, 'forEach', 'each')
alias(A.prototype, 'includes', 'has')
alias(S.prototype, 'includes', 'has')
alias(S.prototype, 'endsWith', 'ends')
alias(S.prototype, 'startsWith', 'starts')
alias(S.prototype, 'charCodeAt', 'code')
alias(S.prototype, 'codePointAt', 'point')
alias(S, 'fromCharCode', 'code')
alias(S, 'fromCodePoint', 'point')
aliasGet(S.prototype, 'charCodeAt', 'ch')
aliasGet(S.prototype, 'codePointAt', 'pt')
aliasGet(S.prototype, 'toUpperCase', 'up')
aliasGet(S.prototype, 'toLowerCase', 'low')
aliasGet(S.prototype, 'at', 'head', 0)
aliasGet(S.prototype, 'at', 'tail', -1)
aliasGet(A.prototype, 'at', 'head', 0)
aliasGet(A.prototype, 'at', 'tail', -1)

