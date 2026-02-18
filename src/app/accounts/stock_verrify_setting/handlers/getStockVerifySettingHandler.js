const StockVerifySettingServices = require("../services/getStockVerifySettingServices");

function getStockVerifySettingInfoHandler(fastify) {
    const getStockVerifySetting = StockVerifySettingServices.getStockVerifySettingService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getStockVerifySetting({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getStockVerifySettingInfoHandler;