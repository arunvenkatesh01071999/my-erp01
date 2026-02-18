const getClosingExpencesMstServices = require("../services/getClosingExpencesWhMstServices");

function postClosingExpencesMstGetOneHandler(fastify) {
    const postClosingExpencesMstGetOne = getClosingExpencesMstServices.postClosingExpencesMstGetOneService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postClosingExpencesMstGetOne({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postClosingExpencesMstGetOneHandler;
