import it from 'node:test'

import { strictEqual as eq } from 'assert'

// import { Is } from '../src/util.js'

import format from '../src/yaml/format.js'


it('call as template function', () => {
  eq(format`x: ${ 0 }`, 'x: 0')
})

it('call as function', () => {
  eq(format(`$0 $1 $0`, '-', 'x'), '- x -')
})

// it('handle array args', () => {
//   let a = 'a'
//   let b = [ 'b', 'c' ]
//   let c = 'd'
//   let re = 'a bc d'

//   eq(format`${ a } ${ b } ${ c }`, re, '[ call as tag ]')
//   eq(format('$0 $1 $2', a, b, c),  re, '[ call as function ]')
// })

// it('handle regex args', () => {
//   let a = 'a'
//   let b = /b|c/
//   let c = 'd'
//   let re = 'a b|c d'

//   eq(format`${ a } ${ b } ${ c }`, re, '[ call as tag ]')
//   eq(format('$0 $1 $2', a, b, c),  re, '[ call as function ]')
// })

// it('handle undefined args', () => {
//   let a = 'a'
//   let b = undefined
//   let c = 'd'
//   let re = 'a  d'

//   eq(format`${ a } ${ b } ${ c }`, re, '[ call as tag ]')
//   eq(format('$0 $1 $2', a, b, c),  re, '[ call as function ]')
// })
