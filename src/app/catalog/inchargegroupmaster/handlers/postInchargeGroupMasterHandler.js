const inchargeGroupMasterService = require("../services/inchargeGroupMasterServices");

function postInchargeGroupMasterHandler(fastify) {
  const postTypedesign = inchargeGroupMasterService.postInchargeGroupMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postTypedesign({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postInchargeGroupMasterHandler;
