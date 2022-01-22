import { O, T, is, set } from '../util.js'

const links = O.freeze({
  Set: '=',
  Map: '=',
  Array: '-',
  Object: ':',
})

Yaml.stringify = stringify
export default function Yaml(str, ...argv) {
  if (is.a(str.raw))
    str = String.raw(str, ...argv)

  let prev
  let tree = Block(0, 'tree')
  let curr = tree
  let blocks = [ curr ]

  for (const line of str.split(/\n+/)) {
    let i = line.length - line.trimStart().length
    let tag = line.trim()
    if (tag.length === 0)
      continue
    is.i.assert(i /= 2, `Bad Indent at line: [${ i }, ${ line }]`)

    if (i > curr.i) {
      prev = curr
      blocks.push(curr = Block(i, tag, prev))
    }
    else {
      prev = blocks.findLast(b => b.i === i)
      curr = Block(i, tag, prev?.parent ?? prev)
    }
  }

  return set(tree, 'blocks', blocks.map(({ i, tag, parent = Block(-1) }) => ({
    i,
    tag,
    parent: `${ parent.i }:${ parent.tag }`,
  })))
}

export function stringify(x, tab = '  ') {
  if (is.n(tab))
    tab = ' '.repeat(tab)
  return format(x, {
    tab,
    res: [],
    seen: new WeakSet,
  }, []).join('\n')
}

function Block(i, tag = '', parent) {
  const b = [ tag.trim() ]
  set(b, 'i', i)
  set(b, 'tag', tag)
  set(b, 'parent', parent)
  parent?.push(b)
  return b
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
      for (const [ k, v ] of x?.entries?.() ?? O.entries(x))
        format(v, o, path.concat(k))
    }
  }
  else {
    resolve(x, path, o)
  }
  return o.res
}

function resolve(x, path, opt) {
  let n    = path.length
  let val  = opt.tab.repeat(n)
  let key  = path[ n - 1 ] ?? ''
  let link = links[ opt.prev ] ?? '~'
  opt.res.push(val + key + link + ' ' + x ?? '')
}



