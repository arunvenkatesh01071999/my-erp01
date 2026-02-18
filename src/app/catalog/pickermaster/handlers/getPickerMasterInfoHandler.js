const pickermasterService = require("../services/pickermasterService");

function getPickerMasterInfoHandler(fastify) {
  const getPickerMasterInfo = pickermasterService.getPickerMasterInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getPickerMasterInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getPickerMasterInfoHandler;
