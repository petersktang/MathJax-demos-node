import fs from 'node:fs'

export function texRead(fname) {
    let texContent = fname
    try {
        fs.accessSync(fname, fs.constants.F_OK)
        texContent = fs.readFileSync(fname, { encoding: 'utf8' });
    } catch (err) {
        console.log('File doesnt exist', fname, ' -> ', err)
    }
    return texContent
}
function svgWrite(svg, fname) {
    fs.writeFileSync(fname, svg, function(err) {
        if(err) {
         return console.log(err);
        }
    });
}
export function svgOutput(MathJax, node, container, styles, css, CSS, outputFile) {
    const adaptor = MathJax.startup.adaptor;
    //
    //  If the --css option was specified, output the CSS,
    //  Otherwise, output the typeset math as SVG
    //
    if (css) {
        console.log(adaptor.textContent(MathJax.svgStylesheet()));
    } else {
        let html = (container ? adaptor.outerHTML(node) : adaptor.innerHTML(node));
        let svg = styles ? html.replace(/<defs>/,  `<defs><style>${CSS}</style>`) : html
        svgWrite(svg, outputFile)
    };
}