const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { CONSUMER } = require("../../commons");


function consumerRepo(fastify) {
  async function getConsumer({ logTrace }) {
    const knex = this;
    const query = knex(CONSUMER.NAME).where(CONSUMER.COLUMNS.IS_ACTIVE, "1");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get CONSUMER",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "CONSUMER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }


  async function getConsumerPaginate({ params, logTrace }) {
    const knex = this;
    const query = knex(CONSUMER.NAME);

    if (params.search && params.search.length >= 3) {
      query.where(function () {
        this.where(
          CONSUMER.COLUMNS.CONSUMER_NAME,
          "like",
          `%${params.search}%`
        )
         
      });
    };
    logQuery({
      logger: fastify.log,
      query,
      context: "Get CONSUMER",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "CONSUMER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    if (response.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    return response;
  }
  async function postConsumer({ params, body, logTrace,userDetails }) {
    const knex = this;
    const query = knex(CONSUMER.NAME).where(
      CONSUMER.COLUMNS.CONSUMER_NAME,
      body.consumer_name
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Consumer Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
  

    const query_insert = await knex(`${CONSUMER.NAME}`).insert({
      [CONSUMER.COLUMNS.CONSUMER_NAME]: body.consumer_name,
      [CONSUMER.COLUMNS.COMPANY_ID]: body.company_id,
      [CONSUMER.COLUMNS.IS_ACTIVE]: body.is_active,
      [CONSUMER.COLUMNS.CREATED_BY]: userDetails.id


    });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating Consumer",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function putConsumer({ consumer_id, body, logTrace ,userDetails}) {
    const knex = this;
    const query = knex(CONSUMER.NAME).where(CONSUMER.COLUMNS.ID, consumer_id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Consumer not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${CONSUMER.NAME}`)
      .where(`${CONSUMER.COLUMNS.ID}`, consumer_id)
      .update({
        [CONSUMER.COLUMNS.CONSUMER_NAME]: body.consumer_name,
        [CONSUMER.COLUMNS.COMPANY_ID]: body.company_id,
        [CONSUMER.COLUMNS.IS_ACTIVE]:parseInt(1),
        // [CONSUMER.COLUMNS.UPDATED_BY]: userDetails.result.id
        [CONSUMER.COLUMNS.UPDATED_BY]: userDetails.id

      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind Consumer",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function deleteConsumer({ consumer_id, body, logTrace }) {
    const knex = this;
    const query = knex(CONSUMER.NAME).where(CONSUMER.COLUMNS.ID, consumer_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Consumer not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(CONSUMER.NAME)
      .where(CONSUMER.COLUMNS.ID, consumer_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete CONSUMER",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "CONSUMER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }
  async function getConsumerInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(CONSUMER.NAME).where(CONSUMER.COLUMNS.ID, params.consumer_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get CONSUMER Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "CONSUMER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  return {
    getConsumer,
    postConsumer,
    putConsumer,
    deleteConsumer,
    getConsumerInfo,
    getConsumerPaginate
  };
}

module.exports = consumerRepo;
