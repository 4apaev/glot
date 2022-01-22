/* eslint-disable no-unused-vars */
import {
  strictEqual as eq,
  deepStrictEqual as equal,
} from 'assert'

import format, { stringify } from '../src/yaml/format.js'


describe('yaml.format', () => {
  it('[call as tag]', () => {
    eq(tmpl`x: ${ 0 }`, 'x: 0')
  })

  it('[call as function]', () => {
    eq(tmpl(`$0 $1 $0`, '-', 'x'), '- x -')
  })

  it('handle array args', () => {
    let a = 'a'
    let b = [ 'b', 'c' ]
    let c = 'd'
    let re = 'a bc d'

    eq(tmpl`${ a } ${ b } ${ c }`, re, '[ call as tag ]')
    eq(tmpl('$0 $1 $2', a, b, c),  re, '[ call as function ]')
  })

  it('handle regex args', () => {
    let a = 'a'
    let b = /b|c/
    let c = 'd'
    let re = 'a b|c d'

    eq(tmpl`${ a } ${ b } ${ c }`, re, '[ call as tag ]')
    eq(tmpl('$0 $1 $2', a, b, c),  re, '[ call as function ]')
  })


  it('handle undefined args', () => {
    let a = 'a'
    let b = undefined
    let c = 'd'
    let re = 'a  d'

    eq(tmpl`${ a } ${ b } ${ c }`, re, '[ call as tag ]')
    eq(tmpl('$0 $1 $2', a, b, c),  re, '[ call as function ]')
  })

})
