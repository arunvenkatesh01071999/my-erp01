const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/subaccounts",
    schema: schemas.getSubAccountsSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getSubAccountsHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/subaccounts",
    schema: schemas.postSubAccountsSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postSubAccountsHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/subaccounts/:subaccount_id",
    schema: schemas.putSubAccountsSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putSubAccountsHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/subaccounts/:subaccount_id",
    schema: schemas.deleteSubAccountsSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteSubAccountsHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/subaccounts/info/:subaccount_id",
    schema: schemas.getSubAccountsInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getSubAccountsInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/subaccounts/:page_size/:current_page",
    schema: schemas.getSubAccountsPaginateSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getSubAccountsPaginateHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/subaccounts/byaccc/:acc_id",
    schema: schemas.getSubAccountsByAccSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getSubAccountsByAccHandler(fastify)
  });

};
