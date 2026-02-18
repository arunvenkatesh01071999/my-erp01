const WastageOutletMasterServices = require("../services/WastageOutletMasterServices");

function postWastageOutletMasterHandler(fastify) {
  const postWastageOutletMaster = WastageOutletMasterServices.postWastageOutletMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postWastageOutletMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postWastageOutletMasterHandler;
