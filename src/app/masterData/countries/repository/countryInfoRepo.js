const { StatusCodes } = require("http-status-codes");
const { logQuery } = require("../../../commons/helpers");

const { COUNTRIES } = require("../../commons/constants");
const { CustomError } = require("../../../errorHandler");

function countryInfoRepo(fastify) {
  async function getCountryInfo({ logTrace }) {
    const knex = this;

    const query = knex(COUNTRIES.NAME);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Countries Info details",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Countries info not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  return {
    getCountryInfo
  };
}

module.exports = countryInfoRepo;
