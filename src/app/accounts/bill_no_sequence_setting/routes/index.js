const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/bill_no_sequence",
    schema: schemas.postBillNoSequenceSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postBillNoSequenceHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/bill_no_sequence/:company_id/:wh_id/:outlet_id/:counter",
    schema: schemas.putBillNoSequenceSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putBillNoSequenceHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/bill_no_sequence/:id",
    schema: schemas.deleteBillNoSequenceSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteBillNoSequenceHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/bill_no_sequence/info/:company_id/:wh_id/:outlet_id/:counter",
    preHandler: fastify.authenticate,
    schema: schemas.getBillNoSequenceInfoSchema,
    handler: handlers.getBillNoSequenceHandler(fastify)
  });


};
