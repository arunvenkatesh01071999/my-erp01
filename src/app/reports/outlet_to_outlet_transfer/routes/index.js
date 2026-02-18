const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/outlet/to/outlet/transfer",
    // preHandler: fastify.authenticate,
    // schema: schemas.outletToOutletTransferReportSchema,
    handler: handlers.outletToOutletTransferReportHandler(fastify)
  })

  fastify.route({
    method: "POST",
    url: "/reports/outlet/to/outlet/transfer/unowned",
    // preHandler: fastify.authenticate,
    // schema: schemas.outletToOutletTransferReportSchema,
    handler: handlers.outletToOutletTransferUnOwnedReportHandler(fastify)
  })
};
