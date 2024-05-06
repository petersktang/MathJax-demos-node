# Mathjax preload, load log

- `loader: { load: ['input/tex', 'output/svg'] },`
- `PACKAGES = 'base, autoload, require, ams, newcommand';`

```
preload ...  [ 'loader', 'startup' ]
preload ...  [ 'loader', 'startup', 'core', 'adaptors/liteDOM' ]
load ......  [ 'input/tex', 'output/svg' ]
preload ...  [
  'input/tex-base',
  '[tex]/ams',
  '[tex]/newcommand',
  '[tex]/noundefined',
  '[tex]/require',
  '[tex]/autoload',
  '[tex]/configmacros'
]
load ......  [ '[mathjax-modern]/svg' ]
load ......  [ '[tex]/mhchem' ]
```

### Findings
- with or without PACKAGES defined, input/tex seems to have all the required preloads defined, because component/mjs/input/tex/tex.js has it covered.
- tex2svg2.mjs:PACKAGES needs to cover the omitted if above is inadequate.
- components/mjs/node-main/node-main.js preloads [loader, startup, core, adaptors/liteDOM]

### The Process
- global defines all the common functions
- loader fetches from source.js and load into MathJax._.input.tex_ts.TeX
- startup defines the necessary tex2svg and tex2svgPromise
- MathDocument.convert parses the input.
- Startup.getComponents() [handler is register/unregister] -> Startup.getDocument()
- getDocument() somehow invokes liteAdaptor:LibteBase:constructor() where LiteParser() and LiteWindow() is attached.
- Where is LiteParser registered? mathjax-full/ts/adaptors/lite/Parser.ts::LiteParser

### The liteDOM story/observations
- node-main -> 'adaptors/liteDOM' -> liteAdaptor -> liteBase
- MathJax.startup.document is undefined before CONFIG.ready(), and nicely configured post CONFIG.ready()

- in startup.ts:293 Startup.defaultReady.bind(Startup), and 
- in loader.ts:205 Loader.defaultReady.bind(Loader), 
- both indirectly setup ready().

- loader.ts: export const CONFIG = MathJax.config.loader
- CONFIG.ready() ==> MathJax.config.loader.ready()
- ... => mathjax.document() -> handler.handlesDocument()

### console.log(MathJax.config.startup) post tex2svgPromise
```
  input: [ 'tex' ],
  output: 'svg',
  document: '',
  typeset: false,
  ready: [Function: bound ],
  pageReady: [Function: bound ],
  handler: 'HTMLHandler',
  adaptor: 'liteAdaptor'
```

### Debugging howto
- change only webpack.common.js {"devtool": "inline-source-map"; mode: "development"; optimize:minimize: false}, liteAdaptor.ts:debugger
- LiteAdaptor.LiteBase, NodeAdaptor, LiteAdaptor, liteAdaptor
