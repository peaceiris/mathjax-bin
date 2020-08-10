const mjAPI = require("mathjax-node");
const getStdin = require("get-stdin");

mjAPI.config({
  MathJax: {
    // traditional MathJax configuration
  },
});
mjAPI.start();

(async () => {
  const input = await getStdin();

  mjAPI.typeset(
    {
      math: input.trim(),
      format: "TeX",
      svg: true,
    },
    function (data) {
      if (!data.errors) {
        console.log(data.svg);
      }
    }
  );
})();
