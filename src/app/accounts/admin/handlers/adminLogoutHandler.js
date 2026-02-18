const adminServices = require("../services/adminServices");

function adminLogoutHandler(fastify) {
    const adminLogout = adminServices.adminLogoutService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await adminLogout({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = adminLogoutHandler;
