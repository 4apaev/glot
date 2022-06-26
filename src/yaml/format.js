import Yaml from './blocks.js'
import { S, Is, Log, use } from '../util.js'

export default function format(s, ...a) {
  if (s?.raw)
    return S.raw(s, ...a)

  let re = s.replace(/\{(\d)\}/g, (_, k) => tost(a[ +k ] ?? k))

  if (re !== s)
    return re

  let i = 0
  return s.replace(/%([sO%idbox])/g, (_, k) => k in format
    ? format[ k ](a[ i++ ])
    : a[ i++ ])
}

function tost(x) {
  return Is.o(x)
    ? Yaml.stringify(x)
    : S(x)
}

use(format, {
  O: tost,
  j(x) { return x },
  s(x) { return x },
  i(x) { return 0 | x },
  d(x) { return parseFloat(x, 10) },
  b(x) { return '0b' + parseInt(x).toString(2) },
  o(x) { return '0o' + parseInt(x).toString(8) },
  x(x) { return '0x' + parseInt(x).toString(16) },
  p(x) { return '0x' + parseInt(x).toString(16) },
})

