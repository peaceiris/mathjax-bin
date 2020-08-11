const mjAPI = require("mathjax-node");
const getStdin = require("get-stdin");

mjAPI.config({
  MathJax: {
    // traditional MathJax configuration
  },
});
mjAPI.start();

(async () => {
  const base64Str = await getStdin();
  const math = new Buffer(base64Str, "base64");

  mjAPI.typeset(
    {
      math: math,
      format: "TeX",
      svg: true,
    },
    function (data) {
      if (!data.errors) {
        console.log(data.svg);
      }
    },
  );
})();
