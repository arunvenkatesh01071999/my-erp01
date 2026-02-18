const itemService = require("../services/itemService");

function postItemSyncHanlder(fastify) {
    const postItemDetails = itemService.postItemService(fastify);

    return async (request, replay) => {
        const { userDetails } = request;
        const response = await postItemDetails({
            userDetails
        });
        return replay.code(200).send(response);
    }
}

module.exports = postItemSyncHanlder;