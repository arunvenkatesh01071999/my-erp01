const { StatusCodes } = require("http-status-codes");
const { logQuery } = require("../../../commons/helpers");
const { CITIES, STATES, COUNTRIES } = require("../../commons/constants");
const { CustomError } = require("../../../errorHandler");
const axios = require("axios");

function cityInfoRepo(fastify) {
  async function getCityInfo({ state_id, logTrace }) {
    const knex = this;

    const query = knex(CITIES.NAME).where(CITIES.COLUMNS.STATE_ID, state_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Cities Info details",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Cities info not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getCityByPincodeRepo({ pincode, logTrace }) {
    const knex = this;

    // Step 1: Fetch state info by pincode
    const responseApi = await axios.get(`http://www.postalpincode.in/api/pincode/${pincode}`);
    const city_name = responseApi.data?.PostOffice?.[0]?.District;
    const state_name = responseApi.data?.PostOffice?.[0]?.State;

    if (!state_name) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "City info not found for given pincode",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // Step 2: Get State + Country details
    const stateResponse = await knex(STATES.NAME)
      .select(
        knex.raw(
          `jsonb_build_object('id', ${STATES.NAME}.${STATES.COLUMNS.ID}, 'name', ${STATES.NAME}.${STATES.COLUMNS.NAME}) as state`
        ),
        knex.raw(
          `jsonb_build_object('id', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}, 'name', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}) as country`
        )
      )
      .leftJoin(
        COUNTRIES.NAME,
        `${STATES.NAME}.${STATES.COLUMNS.COUNTRYID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .whereILike(`${STATES.NAME}.${STATES.COLUMNS.NAME}`, `%${state_name}%`)
      .limit(1);

    if (!stateResponse.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "State not found in database",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const state_id = stateResponse[0].state.id;
    console.log(city_name, state_id, "city_name")
    // Step 3: Get City info for the found state
    const citiesResponse = await knex(CITIES.NAME)
      .select(
        knex.raw(
          `jsonb_build_object('id', ${CITIES.NAME}.${CITIES.COLUMNS.ID}, 'name', ${CITIES.NAME}.${CITIES.COLUMNS.NAME}) as city`
        )
      )
      .where(`${CITIES.NAME}.${CITIES.COLUMNS.STATE_ID}`, state_id)
      .whereILike(`${CITIES.NAME}.${CITIES.COLUMNS.NAME}`, `%${city_name}%`)
      .limit(1)
 
    // Step 4: Return final formatted response
    return {
      country: stateResponse[0].country,
      state: stateResponse[0].state,
      city: citiesResponse[0].city
    };
  }


  return {
    getCityInfo,
    getCityByPincodeRepo
  };
}

module.exports = cityInfoRepo;
