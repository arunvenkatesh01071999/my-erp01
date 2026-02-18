const menuServices = require("../services/menuauthServices");

function getRolePermissionPaginationHandler(fastify) {
    const getRolePermissionPagination = menuServices.getRolePermissionPaginationService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await getRolePermissionPagination({
            body,
            params,
            query,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = getRolePermissionPaginationHandler;
