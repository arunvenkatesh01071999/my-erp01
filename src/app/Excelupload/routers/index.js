const handlers = require('../handlers');

module.exports = async fastify => {

    fastify.route({
        method: "POST",
        url: "/upload-excel",
        preHandler: fastify.authenticate,
        handler: handlers.uploadExcelHandler(fastify)
    });
}
