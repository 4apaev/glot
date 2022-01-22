export class Fail extends Error {
  name = 'Fail'
  constructor(m, x) {
    let ise = is(Error, m)
    if (ise) x = m, m = 'rethrow: ' + x.message
    x?.cause ?? (x = { cause: x })
    super(m, x)
    Error.captureStackTrace(this, this.constructor)
    ise && (this.cause.next = this)
  }

  set(a, b) { return (this[ a ] = b), this }
  get prev() { return this.cause }

  static as(a, b) { return new Fail(a, b) }
  static raise(a, b) { throw Fail.as(a, b) }
  static assert(a, b) { !!a || Fail.raise(b, 'assert') }
  static deny(a, b) { return Promise.reject(Fail.as(a, b ?? 'rejected')) }
}

export const {
  assert,
  raise,
  deny,
} = Fail

export function T(x) {
  return toString.call(x).slice(8, -1)
}

T.of = x => typeof x
T.args = (a, cb = T.of, prev = {}) => {
  for (let next of a)
    (prev[ cb(next) ] ??= []).push(next)
  return prev
}
T.args.binary = (a, b) => T.args(a, x => +is.x(x), b ?? [[], []])

export default function is(a, b, c = T(b)) {
  return typeof a == 'function'
    ? c == a.name || Object(b) instanceof a
    : c == a
}

is.T = T
is.not = (a, b) => !is(a, b)
is.assert = (a, b, c) => is(a, b) || raise(c)
is.not.assert = (a, b, c) => is(a, b) && raise(c)

is.a = x => Array.isArray(x)
is.n = x => Number.isFinite(x)
is.i = x => Number.isInteger(x)
is.b = x => typeof x == 'boolean'
is.s = x => typeof x == 'string'
is.S = x => typeof x == 'symbol'
is.f = x => typeof x == 'function'
is.o = x => typeof x == 'object' && !!x
is.O = x => T(x) == 'Object'
is.x = x => x === Object(x)
is.I = x => Symbol.iterator in Object(x)
is.u = x => x != null
is.eq = (a, b) => {
  if (a === b)
    return true

  let t = T(a)
  if (t === T(b))
    return false

  if (t == 'Object')
    t = 'Array', a = Object.entries(a), b = Object.entries(b)

  else if (t == 'Set' || t == 'Map')
    t = 'Array', a = Array.from(a), b = Array.from(b)

  return t == 'Array'
    ? a.length === b.length && a.every((x, i) => is.eq(x, b[ i ]))
    : String(a) === String(b)
}

is.use = (k, fn) => {
  fn ??= is[ k ]
  is.f(fn) || raise(`is.use: "${ k }" is not a function`)

  const i = fn.length

  is[ k ] = fn
  is.not[ k ] =        i === 1
    ?  x     =>!fn(x)
    : i === 2
      ? (a, b) =>   !fn(a, b)
      : (...a) =>!fn(...a)
  is[ k ].assert = i === 1
    ? (x, m) => fn(x) || raise(m)
    : i === 2
      ? (a, b, m) => fn(a, b) || raise(m)
      : (...a) => fn(...a) || raise(a[ i ])
  is.not[ k ].assert = i === 1
    ? (x, m) => fn(x) && raise(m)
    : i === 2
      ? (a, b, m) => fn(a, b) && raise(m)
      : (...a) => fn(...a) && raise(a[ i ])

}

Array.from('anibsSfoOxIu').concat('eq').forEach(k => is.use(k, is[ k ]))



