const typedesignService = require("../services/typedesignService");

function postTypeDesignSyncHanlder(fastify) {
    const postTypeDesignDetails = typedesignService.postTypeDesignService(fastify);

    return async (request, replay) => {
        const { userDetails } = request;
        const response = await postTypeDesignDetails({
            userDetails
        });
        return replay.code(200).send(response);
    }
}

module.exports = postTypeDesignSyncHanlder;