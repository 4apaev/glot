import {
  is,
  tmpl,
  alias,
  def as use,
} from './util.js'

export default function Log(s, ...a) {
  console.log.apply(console, is.a(s?.raw)
    ? tmpl(s, a)
    : arguments)
}

use(Log, console)
alias(Log, 'groupEnd', 'end')
alias(Log, 'groupCollapsed', 'compact')

use(Log, {
  open(x, ...a) {
    let method = 'group'

    if (is.s(x) && x.startsWith('[x]'))
      method += 'Collapsed', x = x.replace('[x]', '{@}')
    Log[ method ](x, ...a)
  },

  each(name, a) {
    if (is.a(name))
      a = name, name = 'Each'
    Log.compact(name)
    for (let x of a) Log(x)
    Log.end()
  },

  test(times, fn, ...argv) {
    const re = new Set
    const start = performance.now()
    while (times--) re.add(fn.apply(this, argv))
    return [ performance.now() - start, fn.name, Array.from(re) ]
  },

  testAll(times, argv, ...fns) {
    const re = fns.map(f => test(times, f, ...argv)).sort((a, b) => a[ 0 ] - b[ 0 ])
    re.forEach(([ ms, name, re ]) => Log(`[ %s ❌ %d ]: %dms = %o`, name, times, ms, re))
    return re
  },
})

/*

  Log.open('[x]', 'doggo')
    Log.write`
      shoshi ${ 'THE DOG'.low  }
      jacko ${ 'good boi'.up  }
    `
    Log.open('next')
      Log.each('cats', [ 'fredy', 'cindy' ])
    Log.end()
    Log('====== the end =======')
  Log.end()


*/



























