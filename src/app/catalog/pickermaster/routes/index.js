const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/pickermaster",
    preHandler: fastify.authenticate,
    schema: schemas.getPickerMasterSchema,
    handler: handlers.getPickerMasterHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/pickermaster",
    preHandler: fastify.authenticate,
    schema: schemas.postPickerMasterSchema,
    handler: handlers.postPickerMasterHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/pickermaster/:pickermaster_id",
    preHandler: fastify.authenticate,
    schema: schemas.putPickerMasterSchema,
    handler: handlers.putPickerMasterHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/pickermaster/:pickermaster_id",
    preHandler: fastify.authenticate,
    schema: schemas.deletePickerMasterSchema,
    handler: handlers.deletePickerMasterHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/pickermaster/:pickermaster_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPickerMasterInfoSchema,
    handler: handlers.getPickerMasterInfoHandler(fastify)
  });

  // fastify.route({
  //   method: "GET",
  //   url: "/brand/typedesign/:cat_id/:sub_cat_id/:head_id",
  //   preHandler: fastify.authenticate,
  //   schema: schemas.getTypeDesignByCategorySchema,
  //   handler: handlers.getBrandTypedesignInfoHandler(fastify)
  // });

  fastify.route({
    method: "GET",
    url: "/pickermaster/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getPickerMasterPaginateSchema,
    handler: handlers.getPickerMasterPaginateHandler(fastify)
  });
};
