const headsService = require("../services/headsService");

function postHeadsSyncHanlder(fastify) {
    const postHeadsDetails = headsService.postHeadsService(fastify);

    return async (request, replay) => {
        const { userDetails } = request;
        const response = await postHeadsDetails({
            userDetails
        });
        return replay.code(200).send(response);
    }
}

module.exports = postHeadsSyncHanlder;