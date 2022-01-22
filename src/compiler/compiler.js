/* eslint-disable no-unused-vars */

export const tokenizeCharacter = (type, value, input, current) =>
  value === input[ current ]
    ? [ 1, { type, value }]
    : [ 0, null ]

export const tokenizeParenOpen = (input, current) =>
  tokenizeCharacter('paren', '(', input, current)

export const tokenizeParenClose = (input, current) =>
  tokenizeCharacter('paren', ')', input, current)

export const tokenizePattern = (type, pattern, input, current) => {
  let char = input[ current ]
  let consumedChars = 0
  if (pattern.test(char)) {
    let value = ''
    while (char && pattern.test(char)) {
      value += char
      consumedChars ++
      char = input[ current + consumedChars ]
    }
    return [ consumedChars, { type, value }]
  }
  return [ 0, null ]
}

export function tokenizeNumber(input, current) {
  return tokenizePattern('number', /[0-9]/, input, current)
}

export function tokenizeName(input, current) {
  return tokenizePattern('name', /[a-z]/i, input, current)
}

export function tokenizeString(input, current) {
  if (input[ current ] === '"') {
    let value = ''
    let consumedChars = 0
    consumedChars++
    let char = input[ current + consumedChars ]

    while (char !== '"') {
      if (char === undefined)
        throw new TypeError('unterminated string ')

      value += char
      consumedChars++
      char = input[ current + consumedChars ]
    }

    return [ consumedChars + 1, { type: 'string', value }]
  }
  return [ 0, null ]
}


export function skipWhiteSpace(input, current) {
  return (/\s/.test(input[ current ]))
    ? [ 1, null ]
    : [ 0, null ]
}

export const tokenizers = [
  skipWhiteSpace,
  tokenizeParenOpen,
  tokenizeParenClose,
  tokenizeString,
  tokenizeNumber,
  tokenizeName,
]

export function tokenizer(input) {
  let current = 0
  let tokens = []

  while (current < input.length) {
    let tokenized = false

    tokenizers.forEach(tok => {
      if (tokenized)
        return

      let [ consumedChars, token ] = tok(input, current)
      if (consumedChars !== 0) {
        tokenized = true
        current += consumedChars
      }
      token && tokens.push(token)

    })

    if (!tokenized)
      throw new TypeError('Bad Char')

  }
  return tokens
}

export function parseNumber(tokens, current) {
  return [ current + 1,
    {
      type: 'NumberLiteral',
      value: tokens[ current ].value,
    }]
}

export function parseString(tokens, current) {
  return [ current + 1,
    {
      type: 'StringLiteral',
      value: tokens[ current ].value,
    }]
}

export function parseExpression(tokens, current) {
  let param
  let token = tokens[ ++current ]
  let node = {
    type: 'CallExpression',
    name: token.value,
    params: [],
  }

  token = tokens[ ++current ]

  while (!(token.type === 'paren' && token.value === ')')) {
    [ current, param ] = parseToken(tokens, current)
    node.params.push(param)
    token = tokens[ current ]
  }
  current++
  return [ current, node ]
}

export function parseToken(tokens, current) {
  let token = tokens[ current ]
  if (token.type === 'number')
    return parseNumber(tokens, current)

  if (token.type === 'string')
    return parseString(tokens, current)

  if (token.type === 'paren' && token.value === '(')
    return parseExpression(tokens, current)

  throw new TypeError(token.type)
}

function parseProgram(tokens) {
  let current = 0
  let node = null
  let ast = {
    type: 'Program',
    body: [],
  }
  while (current < tokens.length) {
    [ current, node ] = parseToken(tokens, current)
    ast.body.push(node)
  }
  return ast
}


export const emitter = node => {
  switch (node.type) {
    case 'Program': return node.body.map(exp => emitter(exp) + ';').join('\n')
    case 'CallExpression': return `${ node.name }(${ node.params.map(emitter).join(', ') })`
    case 'NumberLiteral': return node.value
    case 'StringLiteral': return `"${ node.value }"`
    default:
      throw new TypeError(node.type)
  }
}

