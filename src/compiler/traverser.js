export default function traverser(ast, visitor) {

  function each(parent, node) {
    const methods = visitor[ node.type ]
    methods?.enter?.(node, parent)

    switch (node.type) {
      case 'NumberLiteral':
      case 'StringLiteral':
        break

      case 'CallExpression':
        node.params.reduce(each, node)
        break

      case 'Program':
        node.body.reduce(each, node)
        break

      default:
        throw new TypeError(node.type)
    }

    methods?.exit?.(node, parent)
  }

  each(null, ast)
}
