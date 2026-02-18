const getClosingExpencesMstServices = require("../services/getClosingExpencesMstServices");

function postClosingBankAmountHandler(fastify) {
    const postClosingBankAmount = getClosingExpencesMstServices.postClosingBankAmountService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postClosingBankAmount({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postClosingBankAmountHandler;
