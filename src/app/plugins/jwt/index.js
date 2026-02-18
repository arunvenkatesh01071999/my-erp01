const fp = require("fastify-plugin");

const authenticatePlugin = async fastify => {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      const decodedToken = await request.jwtVerify();
      // console.log("userDetails" + JSON.stringify(decodedToken));
      // console.log(decodedToken.response[0].id);
      // console.log(decodedToken);
      request.userDetails = decodedToken.response[0] === undefined ? decodedToken.response : decodedToken.response[0];
      // request.otpDetails = decodedToken;
    } catch (err) {
      reply.send(err);
    }
  });
};

module.exports = fp(authenticatePlugin);
