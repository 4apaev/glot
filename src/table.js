
export default function table(it, cols, size = 4) {
  cols ??= Object.keys(it[ 0 ])

  const n = cols.length
  const colSizes = Array(n).fill(size)

  const set = (col, y, x) => {
    const len = col.length
    if (len > colSizes[ x ])
      colSizes[ x ] = len
    return col
  }

  const setup = (row, y) =>
    cols.map((k, x) =>
      set(row[ k ], y, x))

  const render = row => {
    const arr = row.map((k, x) =>
      k.padEnd(colSizes[ x ]))
    return `
  │ ${ arr.join(' │ ') } │`
  }

  const body = it.map(setup)
  const stub = colSizes.map(i => '─'.repeat(i))
  return `
  ┌─${ stub.join('─┬─') }─┐${ body.map(render).join(`
  ├─${ stub.join('─┼─') }─┤`) }
  └─${ stub.join('─┴─') }─┘`
}
