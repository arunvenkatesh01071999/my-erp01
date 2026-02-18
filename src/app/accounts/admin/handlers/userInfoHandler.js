const adminServices = require("../services/adminServices");

function userInfoHandler(fastify) {
    const userInfo = adminServices.userInfoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await userInfo({
            body,
            params,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = userInfoHandler;
