export const µ = undefined
export const O = Object
export const A = Array
export const F = Function
export const B = Boolean
export const N = Number
export const S = String
export const E = Error
export const P = Promise

export const {
  keys,
  assign,
  fromEntries,
} = O

///////////////////////////////////////////////////////////

export function T(x) {
  return toString.call(x).slice(8, -1)
}

export function Is(a, b) {
  return arguments.length < 2
    ? a != µ
    : a === b?.constructor
}

Is.a = A.isArray
Is.n = N.isFinite
Is.n.i = N.isInteger
Is.f = x => typeof x == 'function'
Is.b = x => typeof x == 'boolean'
Is.s = x => typeof x == 'string'
Is.S = x => typeof x == 'symbol'
Is.o = x => typeof x == 'object' && !!x
Is.i = x => Symbol.iterator in O(x)
///////////////////////////////////////////////////////////

export class Fail extends Error {
  opts = O.o
  name = 'Fail'

  constructor(m, o) {
    if (Is.n(o))
      o = { code: o }

    else if (Is.s(o) || Is(E, o))
      o = { cause: o }

    super(m, o)
    E.captureStackTrace(this, Fail)
    Is(O, o) && assign(this.opts, o)
  }

  get code() {
    return this.opts.code ??= 0
  }

  static is = x => Is(this, x)
  static as = (m, c) => Reflect.construct(this, [ m, c ])
  static raise = (m, c) => {
    throw Reflect.construct(this, [ m, c ])
  }
}

export function raise(m, o) {
  throw (raise.e = Is.f(o)
    ? new o(m)
    : new Fail(m, o))
}

///////////////////////////////////////////////////////////

export function echo(x) {
  return x
}

export function sleep(...a) {
  return new P(ok =>
    setTimeout(ok, ...a))
}

export function apply(fn, argv, ctx) {
  return Reflect.apply(
    fn,
    ctx,
    argv,
  )
}

export function random(a, b, r = Math.random()) {
  return a == µ
    ? r
    : Math.round(b == µ
      ? r * a
      : r * (b - a) + a)
}

use(echo, {
  argv() {
    return arguments
  },
})

use(random, {
  valueOf: Math.random,

  get bool() {
    return random > .5
  },

  get bin() {
    return N(random.bool)
  },

  get uid() {
    return globalThis.crypto.randomUUID()
  },

  rnd(a, b, c = new Set) {

    crypto.randomInt

  },

  string(size, prev = '') {
    prev += A.from('abcdefghijklmnopqrstuvwxyz').sort(() => random.bool ? 1 : -1).join('')
    return prev.length < size
      ? random.string(size, prev)
      : prev.slice(0, size)
  },
})

///////////////////////////////////////////////////////////

export function mix(...a) {
  return assign(O.o, ...a)
}

export function use(a, b) {
  return O.defineProperties(a,
    O.getOwnPropertyDescriptors(b))
}

export function alias(a, b, c = b, d = a) {
  return O.defineProperty(d, c,
    O.getOwnPropertyDescriptor(a, b))
}

export function entries(x) {
  return Is.i(x)
    ? x?.entries?.() ?? A.from(x, (v, k) => [ k, v ])
    : O.entries(x)
}

export function each(it, fx, ctx) {
  for (const [ k, v ] of entries(it))
    fx.call(ctx, k, v)
  return ctx
}

///////////////////////////////////////////////////////////

export function predicate(fx) {
  return Is.f(fx)
    ? fx
    : (fx = (e => o => e.every(([ k, v ]) => v === o[ k ]))(entries(fx)))
}

export function fill(n, fx = echo) {
  return Is.f(fx)
    ? A.from({ length: n }, (_, i) => fx(i))
    : new A(n).fill(fx)
}

export function rm(it, iter, ctx, j = 0, re = []) {
  for (let x, i = 0, cb = predicate(iter); i < it.length; i++)
    cb.call(ctx, x = it[ i ], i) ? re.push(x) : it[ j++ ] = it[ i ]
  it.length = j
  return re
}

export function chop(it, n) {
  const re = []
  const cb = n === +n ? (x, i) => 0 === i % n : n
  for (let tmp, i = 0; i < it.length; i++) {
    cb(it[ i ], i) && re.push(tmp = [])
    tmp.push(it[ i ])
  }
  return re
}

export function rotor(n) {
  let h; let c = 0; let i = 0; let r = new A(n)
  return use(r, {
    get i() { return i },
    get head() { return h },
    get cursor() { return c },
    add(x) { return echo(i, h = r[ c = i++ % n ] = x) },
  })
}

export function where(it, iter, ctx) {
  return Is.s(it)
    ? A.from(it.matchAll(iter), ctx ??= x => x?.groups ?? x)
    : it.filter(predicate(iter), ctx)
}

///////////////////////////////////////////////////////////

export function Rx(s, ...a) {
  let fl = ''; let pttr = s?.raw ? S.raw(s, ...a) : s
  pttr = pttr.replace(/( +)?\n+( +)?/g, '').trim()
  pttr = pttr.replace(/\/([gimdsuy]+)\/?$/, (_, f) => echo('', fl += f)).trim()
  return new RegExp(pttr, fl)
}

export function Log(s, ...a) {
  s?.raw
    ? console.log(S.raw(s, ...a))
    : console.log(s, ...a)
}

export function Sym(s, ...a) {
  return typeof k == 'symbol'
    ? Symbol.keyFor(s)
    : Symbol(s?.raw ? S.raw(s, ...a) : s)
}

Sym.ok    = Sym`✅`
Sym.no    = Sym`❎`
Sym.id    = Sym`🆔`
Sym.end   = Sym`🏁`
Sym.once  = Sym`🔂`
Sym.stop  = Sym`⛔️`
Sym.start = Sym`🎬`
Sym.help  = Sym`🆘`
Sym.flag  = Sym`🚩`

alias(console, 'group', 'g')
alias(console, 'groupEnd', 'end')
alias(console, 'groupCollapsed', 'gc')

use(Log, console)
use(Log, {
  each(a) {
    Log.gc('Each')
    for (const x of a)
      Log(x)
    Log.end()
  }
})

///////////////////////////////////////////////////////////

use(O, {
  from: fromEntries,
  get o() {
    return O.create(null)
  },
})

use(S.prototype, {
  get up()    { return this.toUpperCase() },
  get low()   { return this.toLowerCase() },
  get log()   { return Log('%s', this)    },
  get char()  { return this.charCodeAt()  },
  get point() { return this.codePointAt() },
})

