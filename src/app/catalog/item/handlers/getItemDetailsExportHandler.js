const itemServices = require("../services/itemServices");

function getItemDetailsExportHandler(fastify) {
  const getItemDetailsExport = itemServices.getItemDetailsExportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getItemDetailsExport({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getItemDetailsExportHandler;
