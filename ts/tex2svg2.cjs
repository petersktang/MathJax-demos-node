/*************************************************************************
 *
 *  ts/tex2svg - model after simple/tex2svg
 *
 *  Uses MathJax v4 to convert a TeX string to an SVG string.
 *
 * ----------------------------------------------------------------------
 *
 *  Copyright (c) 2024 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


//
//  The default TeX packages to use
//
const PACKAGES = 'base, autoload, require, ams, newcommand';

//
//  Minimal CSS needed for stand-alone image
//
const CSS = [
  'svg a{fill:blue;stroke:blue}',
  '[data-mml-node="merror"]>g{fill:red;stroke:red}',
  '[data-mml-node="merror"]>rect[data-background]{fill:yellow;stroke:none}',
  '[data-frame],[data-line]{stroke-width:70px;fill:none}',
  '.mjx-dashed{stroke-dasharray:140}',
  '.mjx-dotted{stroke-linecap:round;stroke-dasharray:0,140}',
  'use[data-c]{stroke-width:3px}'
].join('');

// process is an OS container for node application.
const argv = require('yargs')(process.argv.slice(2))
    .usage('Usage: $0 [options] --input [file] --output [file]')
    .demandOption(['input', 'output'])
    .alias( 'i', 'input')
    .alias( 'o', 'output')
    .default({
        inline: true,
        em: 16,
        ex: 8,
        width: 80*16,
        packages: PACKAGES,
        styles: true,
        fontCache: true,
        dist: false
    })
    .describe('input', 'Input file')
    .describe('output', 'Output file')

    .describe('inline', 'process as inline math')
    .describe('em', 'em-size in pixels')
    .describe('ex', 'ex-size in pixels')
    .describe('width', 'width of container in pixels')
    .describe('packages', 'the packages to use, e.g. "base, ams"; use "*" to represent the default packages, e.g, "*, bbox"')
    .describe('styles', 'include css styles for stand-alone image')

    .strict()
    .parse()

const rs = require('./readSync.cjs')
const texContent = rs.texRead(argv.input) || ''

require('mathjax-full').init({
  //
  //  The MathJax configuration
  //
  loader: {
      load: ['input/tex', 'output/svg']
  },
  tex: {
      packages: argv.packages.replace('\*', PACKAGES).split(/\s*,\s*/)
  },
  svg: {
      fontCache: (argv.fontCache ? 'local' : 'none')
  },
  startup: {
      typeset: false
  }
}).then((MathJax) => {
  MathJax.tex2svgPromise(texContent, {
    display: !argv.inline,
    em: argv.em,
    ex: argv.ex,
    containerWidth: argv.width
  }).then((node) => {
      rs.svgOutput(MathJax, node, argv.container, argv.styles, argv.css, CSS, argv.output)
  })
}).catch((err) => console.log(err.message));