const { StatusCodes } = require("http-status-codes");
const { logQuery } = require("../../../commons/helpers");

const { STATES } = require("../../commons/constants");
const { CustomError } = require("../../../errorHandler");

function stateInfoRepo(fastify) {
  async function getStateInfo({ country_id, logTrace }) {
    const knex = this;

    const query = knex(STATES.NAME).where(STATES.COLUMNS.COUNTRYID, country_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get States Info details",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "States info not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function stateDelivery({ body, params, logTrace }) {
    const knex = this;
    const query = knex(STATES.NAME).where(STATES.COLUMNS.ID, body.state_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "States not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${STATES.NAME}`)
      .where(`${STATES.COLUMNS.ID}`, body.state_id)
      .update({
        [STATES.COLUMNS.DELIVERYAMOUT]: body.delivery_amount
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating Delivery amount",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true, message: "Delivery amount has been updated" };
  }
  return {
    getStateInfo,
    stateDelivery
  };
}

module.exports = stateInfoRepo;
