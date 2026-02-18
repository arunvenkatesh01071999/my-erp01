const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { PHONE_PAY_HISTORY_LOG } = require("../../../phone_pay_history_log/commons");


function phonePayHistoryLogRepo(fastify) {
  async function getPhonePayHistoryLogReport({ body, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${PHONE_PAY_HISTORY_LOG.NAME}.*`
      ])
      .from(`${PHONE_PAY_HISTORY_LOG.NAME} as ${PHONE_PAY_HISTORY_LOG.NAME}`)

      .whereRaw(
        `DATE(${PHONE_PAY_HISTORY_LOG.NAME}.${PHONE_PAY_HISTORY_LOG.COLUMNS.TRANSACTION_DATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${PHONE_PAY_HISTORY_LOG.NAME}.${PHONE_PAY_HISTORY_LOG.COLUMNS.TRANSACTION_DATE}) >= ?`,
        [body.from_date]
      )

    logQuery({
      logger: fastify.log,
      query,
      context: "Get phone pay history log",
      logTrace
    });

    if (params.search && params.search.length >= 3) {
      query.where(function () {
        this.where(
          PHONE_PAY_HISTORY_LOG.COLUMNS.PHONE_NO,
          "ilike",
          `%${params.search}%`
        ).orWhere(
          PHONE_PAY_HISTORY_LOG.COLUMNS.TRANSACTION_ID,
          "ilike",
          `%${params.search}%`
        );
      });
    }



    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    console.log(response, "response");

    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Phone Pay History Log Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    if (response.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Phone Pay History Log Not Found",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // const response = await query;
    // if (!response.length) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_FOUND,
    //     message: "Get phone pay history log",
    //     property: "",
    //     code: "NOT_FOUND"
    //   });
    // }

    return response;
  }

  return {
    getPhonePayHistoryLogReport
  };
}

module.exports = phonePayHistoryLogRepo;
