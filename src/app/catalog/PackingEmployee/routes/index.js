const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/packing_employee",
    schema: schemas.getPackingEmployeeSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getPackingEmployeeHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/packing_employee",
    schema: schemas.postPackingEmployeeSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postPackingEmployeeHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/packing_employee/:id",
    schema: schemas.putPackingEmployeeSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putPackingEmployeeHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/packing_employee/:id",
    schema: schemas.deletePackingEmployeeSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deletePackingEmployeeHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/packing_employee/info/:id",
    schema: schemas.getPackingEmployeeInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getPackingEmployeeInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/packing_employee/:page_size/:current_page",
    schema: schemas.getPackingEmployeePaginateSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getPackingEmployeePaginateHandler(fastify)
  });
};
