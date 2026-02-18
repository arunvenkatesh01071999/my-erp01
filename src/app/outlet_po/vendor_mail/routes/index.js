const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/outlet/vendor/mail/supplier/list",
    preHandler: fastify.authenticate,
    schema: schemas.getVendorMailSupplierListSchema,
    handler: handlers.getVendorMailSupplierListHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/vendor/mail/brandcompany/list",
    preHandler: fastify.authenticate,
    schema: schemas.getVendorMailBrandCompanyListSchema,
    handler: handlers.getVendorMailBrandCompanyListHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/vendor/mail/insert",
    preHandler: fastify.authenticate,
    schema: schemas.postVendorEmailSchema,
    handler: handlers.postVendorEmailHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/vendor/mail/list/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getVendorMailSchema,
    handler: handlers.getVendorMailHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/vendor/mail/:id",
    preHandler: fastify.authenticate,
    schema: schemas.getVendorMailByIdSchema,
    handler: handlers.getVendorMailByIdHandler(fastify)
  });

  // fastify.route({
  //   method: "GET",
  //   url: "/vendor/mail/excel/export",
  //   preHandler: fastify.authenticate,
  //   schema: schemas.getVendorMailExcelExportSchema,
  //   handler: handlers.getVendorMailExcelExportHandler(fastify)
  // });

  fastify.route({
    method: "POST",
    url: "/vendor/mail/excel/export",
    preHandler: fastify.authenticate,
    schema: schemas.getVendorMailExcelExportSchema,
    handler: handlers.getVendorMailExcelExportHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/vendor/mail/update/:id",
    preHandler: fastify.authenticate,
    schema: schemas.putVendorEmailSchema,
    handler: handlers.putVendorEmailHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/vendor/mail/delete/:id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteVendorMailSchema,
    handler: handlers.deleteVendorEmailHandler(fastify)
  });


  fastify.route({
    method: "POST",
    url: "/vendor/mail/excel/import",
    preHandler: fastify.authenticate,
    // schema: schemas.postVendorEmailSchema,
    handler: handlers.postVendorEmailExcelImportHandler(fastify)
  });


};












