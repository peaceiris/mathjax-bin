const mjAPI = require("mathjax-node");
const server = require("server");
const { post, error } = server.router;
const { status } = server.reply;

mjAPI.config({
  MathJax: {
    // traditional MathJax configuration
  },
});
mjAPI.start();

const port = process.argv[2] === void 0 ? 8989 : process.argv[2];

server(
  {
    port: parseInt(port, 10),
    security: { csrf: false },
    parser: {
      json: { limit: "1mb" },
    },
  },
  [
    post("/", (ctx) => {
      console.log(ctx.data);
      const buff = new Buffer.from(ctx.data.input, "base64");
      const decede = buff.toString("ascii");
      console.log(decede);
      let res = "";
      (async () => {
        mjAPI.typeset(
          {
            math: decede,
            format: "TeX",
            svg: true,
          },
          function (data) {
            if (!data.errors) {
              res = data.svg;
            }
          },
        );
      })();
      return res;
    }),
  ],
  error((ctx) => status(500).send(ctx.error.message)),
);
