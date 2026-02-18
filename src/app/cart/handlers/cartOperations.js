const addItemToCartService = require("../services/addItemToCart");
const updateItemInCartService = require("../services/updateItemInCart");
const deleteItemFromCartService = require("../services/deleteItemFromCart");

function addToCartHandler(fastify) {
  const addItemToCart = addItemToCartService(fastify);
  const updateItemInCart = updateItemInCartService(fastify);
  const deleteItemFromCart = deleteItemFromCartService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    switch (body.mode) {
      case "add": {
        const response = await addItemToCart({
          body,
          params,
          logTrace,
          userDetails
        });
        return reply.code(200).send(response);
      }
      case "subtract": {
        const response = await updateItemInCart({
          body,
          params,
          logTrace,
          userDetails
        });
        return reply.code(200).send(response);
      }
      case "zero": {
        const response = await deleteItemFromCart({
          body,
          params,
          logTrace,
          userDetails
        });
        return reply.code(200).send(response);
      }
      default: {
        const response = await addItemToCart({
          body,
          params,
          logTrace,
          userDetails
        });
        return reply.code(200).send(response);
      }
    }
  };
}

module.exports = addToCartHandler;
