import traverser from './traverser.js'

const Id = 'Identifier'
const Num = 'NumberLiteral'
const Str = 'StringLiteral'
const Exp = 'ExpressionStatement'
const Call = 'CallExpression'


export default function transformer(ast) {


  const ctx = Symbol('ast.context')

  let newAst = {
    type: 'Program',
    body: [],
  }

  ast[ ctx ] = newAst.body

  traverser(ast, {
    [ Num ]: {
      enter(node, parent) {
        parent[ ctx ].push({
          type: Num,
          value: node.value,
        })
      },
    },

    [ Str ]: {
      enter(node, parent) {
        parent[ ctx ].push({
          type: Str,
          value: node.value,
        })
      },
    },

    [ Call ]: {
      enter(node, parent) {
        let expression = {
          type: Call,
          arguments: [],
          callee: {
            type: Id,
            name: node.name,
          },
        }

        node[ ctx ] = expression.arguments

        if (parent.type !== Call)
          expression = {
            type: Exp,
            expression,
          }
        parent[ ctx ].push(expression)
      },
    },
  })

  return newAst
}
