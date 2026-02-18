const menuServices = require("../services/menuauthServices");

function getRolePermissionHandler(fastify) {
    const getRolePermission = menuServices.getRolePermissionService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await getRolePermission({
            body,
            params,
            query,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = getRolePermissionHandler;
