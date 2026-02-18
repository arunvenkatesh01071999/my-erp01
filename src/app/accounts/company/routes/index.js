const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/company",
    schema: schemas.postCompanySchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.postCompanyHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/company/:company_id",
    schema: schemas.putCompanySchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.putCompanyHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/company/:company_id",
    schema: schemas.deleteCompanySchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.deleteCompanyHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/company/:page_size/:current_page",
    schema: schemas.getCompanySchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.getCompanyHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/company/info/:company_id",
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    schema: schemas.getCompanyInfoSchema,
    handler: handlers.getCompanyInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/company",
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    schema: schemas.getCompanyDetailsSchema,
    handler: handlers.getCompanyDetailsHandler(fastify)
  });

};
