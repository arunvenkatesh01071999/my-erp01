const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { OUTLET_PURCHASE_MEMO_MASTER } = require("../../../outlet_memo/commons/constants");
const { REGION } = require("../../../catalog/warehouse/commons/constants")


function purchaseRepo(fastify) {
    
    async function purchaseOrderOutletsRepo({ params, logTrace }) {
        const knex = this;
        const { region_id } = params;

        const query = knex
            .distinct([
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as id`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
            ])
            .from(`${OUTLET_PURCHASE_MEMO_MASTER.NAME} as ${OUTLET_PURCHASE_MEMO_MASTER.NAME}`)
            .leftJoin(`${OUTLETS.NAME} as ${OUTLETS.NAME}`, function () {
                this.on(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, ` ${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID}`);
            })
            .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)
            .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`, Number(region_id))
            .orderBy(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, "desc");


        logQuery({
            logger: fastify.log,
            query,
            context: "Get Outlet list",
            logTrace
        });

        const response = await query;
        if (!response || response.length == 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Outlets not found`,
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response;
    }

    async function purchaseOrderRegionsRepo({ params, logTrace }) {
        const knex = this;

        const query = knex
            .distinct([
                `${REGION.NAME}.${REGION.COLUMNS.ID}`,
                `${REGION.NAME}.${REGION.COLUMNS.REGION_NAME}`,
            ])
            .from(`${OUTLET_PURCHASE_MEMO_MASTER.NAME} as ${OUTLET_PURCHASE_MEMO_MASTER.NAME}`)
            .leftJoin(`${OUTLETS.NAME} as ${OUTLETS.NAME}`, function () {
                this.on(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, ` ${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID}`);
            })
            .leftJoin(`${REGION.NAME} as ${REGION.NAME}`, function () {
                this.on(`${REGION.NAME}.${REGION.COLUMNS.ID}`, ` ${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`);
            })
            .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)
            .orderBy(`${REGION.NAME}.${REGION.COLUMNS.ID}`, "desc");


        logQuery({
            logger: fastify.log,
            query,
            context: "Get Region list",
            logTrace
        });

        const response = await query;
        if (!response || response.length == 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Region not found`,
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response;
    }

    return {
        purchaseOrderOutletsRepo,
        purchaseOrderRegionsRepo
    };
}

module.exports = purchaseRepo;
