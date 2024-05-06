require('mathjax-full').init({
    loader: {load: ['input/tex', 'output/svg']}
  }).then((MathJax) => {
    const svg = MathJax.tex2svg('\\frac{1}{x^2-1}', {display: true});
    console.log(MathJax.startup.adaptor.outerHTML(svg));
  }).catch((err) => console.log(err.message));