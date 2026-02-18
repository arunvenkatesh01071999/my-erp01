const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/wastage_outlet_master",
    preHandler: fastify.authenticate,
    schema: schemas.postWastageOutletMasterSchema,
    handler: handlers.postWastageOutletMasterHandler(fastify)
  });


};
