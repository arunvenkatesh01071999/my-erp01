const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { GROUPS } = require("../commons/constants");

function groupRepo(fastify) {
  async function getGroup({ logTrace }) {
    const knex = this;
    const query = knex(GROUPS.NAME).where(GROUPS.COLUMNS.IS_ACTIVE, "1");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Groups",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "groups not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function getGroupPaginate({ params, logTrace }) {
    const knex = this;
    const query = knex(GROUPS.NAME);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Groups",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "groups not found",
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
  async function postGroup({ params, body, logTrace }) {
    const knex = this;
    const query = knex(GROUPS.NAME).where(
      GROUPS.COLUMNS.GROUP_NAME,
      body.group_name
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Group Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    const query_insert = await knex(`${GROUPS.NAME}`).insert({
      [GROUPS.COLUMNS.GROUP_NAME]: body.group_name,
      [GROUPS.COLUMNS.GROUP_IMAGE]: body.group_image,
      [GROUPS.COLUMNS.IS_ACTIVE]: body.is_active
    });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating Groups",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }
  async function putGroup({ group_id, body, logTrace }) {
    const knex = this;
    const query = knex(GROUPS.NAME).where(GROUPS.COLUMNS.ID, group_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Group not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${GROUPS.NAME}`)
      .where(`${GROUPS.COLUMNS.ID}`, group_id)
      .update({
        [GROUPS.COLUMNS.GROUP_NAME]: body.group_name,
        [GROUPS.COLUMNS.GROUP_IMAGE]: body.group_image,
        [GROUPS.COLUMNS.IS_ACTIVE]: body.is_active
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind Groups",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }
  async function deleteGroup({ group_id, body, logTrace }) {
    const knex = this;
    const query = knex(GROUPS.NAME).where(GROUPS.COLUMNS.ID, group_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Group not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(GROUPS.NAME)
      .where(GROUPS.COLUMNS.ID, group_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete groups",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Groups not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }
  async function getGroupInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(GROUPS.NAME).where(GROUPS.COLUMNS.ID, params.group_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Groups",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "groups not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  return {
    getGroup,
    postGroup,
    putGroup,
    deleteGroup,
    getGroupInfo,
    getGroupPaginate
  };
}

module.exports = groupRepo;
