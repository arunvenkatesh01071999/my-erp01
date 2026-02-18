const stockVerifySettingServices = require("../services/getStockVerifySettingServices");

function postStockVerifySettingHandler(fastify) {
    const postStockVerifySetting = stockVerifySettingServices.postStockVerifySettingService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await postStockVerifySetting({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postStockVerifySettingHandler;
