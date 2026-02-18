const pickermasterService = require("../services/pickermasterService");

function getPickerMasterPaginateHandler(fastify) {
  const getPickerMasterPaginate = pickermasterService.getPickerMasterPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getPickerMasterPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getPickerMasterPaginateHandler;
