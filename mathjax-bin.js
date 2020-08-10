const mjAPI = require("mathjax-node");
const server = require("server");
const { post, error } = server.router;
const { status } = server.reply;

server(
  {
    port: 8888,
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
      return decede;
    }),
  ],
  error((ctx) => status(500).send(ctx.error.message))
);

// mjAPI.config({
//   MathJax: {
//     // traditional MathJax configuration
//   },
// });
// mjAPI.start();

// (async () => {
//   const input = await getStdin();

//   mjAPI.typeset(
//     {
//       math: input.trim(),
//       format: "TeX",
//       svg: true,
//     },
//     function (data) {
//       if (!data.errors) {
//         console.log(data.svg);
//       }
//     }
//   );
// })();
