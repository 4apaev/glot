
import * as Tok from './tokens.js'

export default function tokenizer(input) {
  let current = 0
  let tokens = []

  while (current < input.length) {

    let char = input[ current ]

    if (char === '(' || char === ')') {
      tokens.push({ type: 'paren', value: char })
      current++
      continue
    }


    if (Tok.isSpace(char)) {
      current++
      continue
    }

    if (Tok.isDigit(char)) {
      let value = ''
      while (Tok.isDigit(char)) {
        value += char
        char = input[ ++current ]
      }
      tokens.push({ type: 'number', value })
      continue
    }

    if (Tok.isLetter(char)) {
      let value = ''
      while (Tok.isLetter(char)) {
        value += char
        char = input[ ++current ]
      }
      tokens.push({ type: 'name', value })
      continue
    }

    if (char === '"') {
      let value = ''
      char = input[ ++current ]

      while (char !== '"') {
        value += char
        char = input[ ++current ]
      }

      char = input[ ++current ]
      tokens.push({ type: 'string', value })
      continue
    }

    throw new TypeError(`[ Bad Char ]: ${ char }`)
  }

  return tokens
}
