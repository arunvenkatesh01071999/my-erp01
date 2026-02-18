const syncfetchService = require("../services/syncfetchService");

function getItemSettingsDetailsHandler(fastify) {
    const getItemSettingsDetails = syncfetchService.getItemSettingsSyncDetailsService(fastify);

    return async (request, replay) => {
        const { userDetails, params } = request;
        const response = await getItemSettingsDetails({
            userDetails,
            params
        });
        return replay.code(200).send(response);
    }
}

module.exports = getItemSettingsDetailsHandler;