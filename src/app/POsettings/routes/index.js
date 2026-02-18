const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/posettings",
    preHandler: fastify.authenticate,
    schema: schemas.poSettingsPaginateSchema,
    handler: handlers.poSettingsPaginateHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/posettings/updateflag",
    preHandler: fastify.authenticate,
    schema: schemas.poSettingsFlagSchema,
    handler: handlers.poSettingsFlagHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/mbq/posettings",
    preHandler: fastify.authenticate,
    // schema: schemas.mbqPoSettingsSchema,
    handler: handlers.mbqPoSettingsHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/get/mbq/posettings/outlets/list/:region_id",
    preHandler: fastify.authenticate,
    schema: schemas.purchaseOrderSettingsOutletsSchema,
    handler: handlers.purchaseOrdeSettingsOutletsHandler(fastify)
  });


};
