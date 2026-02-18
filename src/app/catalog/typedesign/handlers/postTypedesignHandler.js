const typedesignServices = require("../services/typedesignServices");

function postTypedesignHandler(fastify) {
  const postTypedesign = typedesignServices.postTypedesignService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await postTypedesign({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postTypedesignHandler;
