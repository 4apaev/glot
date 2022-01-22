import {
  µ,
  is,
  use,
  tmpl,
  alias, A, O,
} from './util.js'

const E = new WeakMap

export default function JQ(s, e = document, cb) {
  if (is.f(e)) cb = e, e = document
  return cb
    ? A.from(e.querySelectorAll(s), cb)
    : document.querySelector(s)
}

use(JQ, {
  get frag() {
    return document.createDocumentFragment()
  },

  find(s, e = document) {
    return e.querySelector(s)
  },

  create(name, props, ...children) {
    const el = document.createElement(name)
    if (props) {
      if (is.O(props))
        el.attr(props)
      else
        el.append.apply(el, [].concat(props))
    }
    el.append(...children)
    return el
  }
})

alias(Node.prototype, 'textContent', 'text')
alias(Node.prototype, 'parentElement', 'parent')

alias(Element.prototype, 'classList', 'clss')
alias(Element.prototype, 'querySelector', 'find')
alias(Element.prototype, 'lastElementChild', 'last')
alias(Element.prototype, 'firstElementChild', 'first')
alias(Element.prototype, 'nextElementSibling', 'next')
alias(Element.prototype, 'previousElementSibling', 'prev')

alias(EventTarget.prototype, 'addEventListener', 'on')
alias(EventTarget.prototype, 'addEventListener', 'on')
alias(EventTarget.prototype, 'removeEventListener', 'off')

use(Element.prototype, {
  $(s, cb) {
    return cb === 1
      ? this.querySelector(s)
      : A.from(this.querySelectorAll(s), cb)
  },

  htm(s, ...a) {
    return s == µ
      ? this.innerHTML
      : this.empty().insert(is.a(s?.raw)
        ? tmpl(s, a).join('')
        : s)
  },

  empty() {
    while (this.first)
      this.removeChild(this.first.off().empty())
    return this
  },

  insert(x, pos = 'beforeEnd') {
    this[ x instanceof Element
      ? 'insertAdjacentElement'
      : 'insertAdjacentHTML' ](pos, x)
    return this
  },

  attr(k, v) {
    const i = arguments.length
    if (i === 0)
      return O.fromEntries(A.from(this.attributes, a => [ a.name, a.value ]))

    if (i === 1) {
      if (is.o(k)) {
        for (const [ a, b ] of O.entries(k))
          this.attr(a, b)
      }
      else { return this.getAttribute(k) }
    }
    else if (i === 2) {
      v ??= false
      let t = (typeof v)[ 0 ]
      if (t == 'b') { this.toggleAttribute(k, v) }
      else if (t == 'n') { this.setAttribute(k, v) }
      else if (t == 's') {
        k.startsWith('clas')
          ? this.classList.add(v)
          : this.setAttribute(k, v) 
      }
      else if (t == 'o') {
        if (k.startsWith('class')) { this.classList.add(...[].concat(v)) }
        else {
          for (const [ a, b ] of O.entries(v))
            this[ k ][ a ] = b
        }
      }
    }
    return this
  },

  on(ch, query, cb, ctx) {
    if (is.f(query))
      ctx = cb, cb = query, query = null

    const listener = query
      ? e => e.target.matches(query) && cb.call(ctx, e)
      : e => cb.call(ctx, e)


    const off = (a, b) => {
      if ((!a || a === ch) && (!b || b === cb)) {
        this.removeEventListener(ch, listener)
        return !1
      }
      return !0
    }

    E.get(this)?.push?.(off) ?? E.set(this, [ off ])
    this.addEventListener(ch, listener)
    return this
  },

  off(e, cb) {
    const it = E.get(this)
    if (it) {
      let j = 0
      if (is.f(e))
        cb = e, e = null
      for (let i = 0; i < it.length; i++) {
        if (!it[ i ](e, cb))
          it[ j++ ] = it[ i ]
      }
      it.length = j
      j === 0 && E.delete(this)
    }
    return this
  },

  emit(e, detail = {}) {
    const ce = new CustomEvent(e, {
      detail,
      bubbles: true,
      cancelable: true,
    })
    this.dispatchEvent(ce)
    return this
  },

})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

;`
script link style
br hr div nav ol ul li dl dt dd
table col colgroup caption tr td th thead tbody tfoot
main header aside footer hgroup h1 h2 h3 h4 h5 h6
article p i q b u s em span pre code del dfn ins kbd
section abbr acronym time address cite mark samp blockquote sub sup big small strong strike
figure figcaption audio video picture img svg canvas a button dialog  details summary
form data datalist fieldset legend label input textarea output meter progress select optgroup option
`.match(/\S+/g).forEach(t => JQ[ t ] = JQ.create.bind(µ, t))








