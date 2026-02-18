const menuServices = require("../services/menuauthServices");

function putRolePermissionHandler(fastify) {
    const putRolePermissionHandler = menuServices.putRolePermissionService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await putRolePermissionHandler({
            body,
            params,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = putRolePermissionHandler;
