const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "PATCH",
    url: "/products/:product_code/images",
    schema: schemas.patchProductImageSchema,
    handler: handlers.patchProductImage(fastify)
  });
};
