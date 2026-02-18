const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/warehouse",
    preHandler: fastify.authenticate,
    schema: schemas.postWareHouseSchema,
    handler: handlers.postWareHouseHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/warehouse/:warehouse_id",
    preHandler: fastify.authenticate,
    schema: schemas.putWareHouseSchema,
    handler: handlers.putWareHouseHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/warehouse/:warehouse_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteWareHouseSchema,
    handler: handlers.deleteWareHouseHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/warehouse/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getWareHousePaginateSchema,
    handler: handlers.getWareHousePaginateHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/warehouse/:warehouse_id",
    preHandler: fastify.authenticate,
    schema: schemas.getWareHouseInfoSchema,
    handler: handlers.getWareHouseInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/warehouse",
    schema: schemas.getWareHouseSchema,
    handler: handlers.getWareHouseHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/warehouses/:warehouse_id/company/details",
    preHandler: fastify.authenticate,
    schema: schemas.getCompanyByIdSchema,
    handler: handlers.getCompanyByIdHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/warehouses/list",
    preHandler: fastify.authenticate,
    schema: schemas.getWareHouseListByIdSchema,
    handler: handlers.getWarehouseListByIdHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/warehouse/citywise/list",
    schema: schemas.getWarehouseCityWiseSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getWarehouseCityWiseHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/region",
    schema: schemas.getRegionSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getRegionHandler(fastify)
  });


  fastify.route({
    method: "GET",
    url: "/warehouse/product/:product_code",
    preHandler: fastify.authenticate,
    schema: schemas.getWareHouseProductSchema,
    handler: handlers.getWarehouseProductHandler(fastify)
  });

};
