/* eslint-disable no-unused-vars */
import {
  strictEqual as eq,
  deepStrictEqual as equal,
} from 'assert'

import Log from '../src/log.js'
import Yaml, {
  Block,
  blocks2array,
} from '../src/yaml/blocks.js'


describe('yaml.blocks', () => {
  it('parse', () => {
    let tree = Yaml`
      a
        b
          c
        d
      e
    `


    Log.each('\n=== YAML:Blocks ===', blocks2array(blocks))


  })
})
























