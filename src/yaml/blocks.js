import {
  O,
  S,
  T,
  Is,
  raise,
  each,
  use,
} from '../util.js'

const links = O.freeze({
  Set: '=',
  Map: '=',
  Array: '-',
  Object: ':',
})

export default function Yaml(str, ...argv) {
  if (str?.raw)
    str = S.raw(str, ...argv)

  let prev
  let tree = Block(0, 'tree')
  let curr = tree
  let blocks = [ curr ]

  for (const line of str.split(/\n+/)) {
    let i = line.length - line.trimStart().length
    let tag = line.trim()
    if (tag.length === 0)
      continue

    Number.isInteger(i /= 2) || raise(`Bad Indent at line: [${ i }, ${ line }]`)

    if (i > curr.i) {
      prev = curr
      blocks.push(curr = Block(i, tag, prev))
    }
    else {
      prev = blocks.findLast(b => b.i === i)
      curr = Block(i, tag, prev?.parent ?? prev)
    }
  }

  return use(tree, {
    blocks: blocks.map(({ i, tag, parent = Block(-1) }) => ({
      i,
      tag,
      parent: `${ parent.i }:${ parent.tag }`,
    }))
  })
}

export function stringify(x, tab = '  ') {
  if (Is.n(tab))
    tab = ' '.repeat(tab)
  return format(x, {
    tab,
    res: [],
    seen: new WeakSet,
  }, []).join('\n')
}

function Block(i, tag = '', parent) {
  const child = [ tag.trim() ]
  use(child, {
    get i() { return i },
    get tag() { return tag },
    get parent() { return parent },
  })

  parent?.push(child)
  return child
}

function format(x, o, path) {
  const next = T(x)
  if (next in links) {
    if (o.seen.has(x))
      return o.res

    o.seen.add(x)
    resolve('', path, o)
    o.prev = next

    if (next == 'Array' || next == 'Set') {
      for (const v of x)
        format(v, o, path.concat(''))
    }
    else {

      each(x, (k, v) => format(v, o, path.concat(k)))

      // for (const [ k, v ] of entries(x))
      //   format(v, o, path.concat(k))
    }
  }
  else {
    resolve(x, path, o)
  }
  return o.res
}

function resolve(x, path, opt) {
  let n = path.length
  let val = opt.tab.repeat(n)
  let key = path[ n - 1 ] ?? ''
  let link = links[ opt.prev ] ?? '~'

  x ??= ''
  link += ' '

  opt.res.push(val + key + link  + x)
}



Yaml.stringify = stringify