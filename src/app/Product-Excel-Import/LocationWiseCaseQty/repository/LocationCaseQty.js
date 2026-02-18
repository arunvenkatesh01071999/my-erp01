const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { LOCATION_CASE_QTY, OUTLET_PRODUCT_MAPPING, XL_IMPORT_LOG } = require("../commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { ITEM } = require("../../../catalog/item/commons/constants");
const { USERS } = require("../../../../app/accounts/admin/commons/constants");


function LocationCaseQtyRepo(fastify) {

    async function postLocationCaseQty({ body, userDetails }) {
        const knex = this;

        if (!Array.isArray(body) || body.length === 0) {
            throw new Error("Payload must be a non-empty array");
        }

        const insertData = await Promise.all(
            body.map(async (item) => {

                const product = await knex(ITEM.NAME)
                    .select(ITEM.COLUMNS.ID)
                    .where(ITEM.COLUMNS.PRODUCT_CODE, item.product_code)
                    .first();

                if (!product) {
                    throw CustomError.create({
                        httpCode: StatusCodes.NOT_FOUND,
                        message: `Invalid Product Code : ${item.product_code}`,
                        property: "",
                        code: "NOT_FOUND"
                    });
                }

                const outlet = await knex(OUTLETS.NAME)
                    .select(OUTLETS.COLUMNS.ID)
                    .where(OUTLETS.COLUMNS.FULLNAME, item.location)
                    .first();

                if (!outlet) {
                    throw CustomError.create({
                        httpCode: StatusCodes.NOT_FOUND,
                        message: `Invalid location: ${item.location}`,
                        property: "",
                        code: "NOT_FOUND"
                    });
                }

                const OutletProductMapping = await knex(OUTLET_PRODUCT_MAPPING.NAME)
                    .select(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID)
                    .where({
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: product.id,
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet.id
                    })
                    .first();

                if (!OutletProductMapping) {
                    throw CustomError.create({
                        httpCode: StatusCodes.NOT_FOUND,
                        message: `Invalid Product Outlet Mapping: item:${item.product_code}, location:${item.location}`,
                        property: "",
                        code: "NOT_FOUND"
                    });
                }

                return {
                    [LOCATION_CASE_QTY.COLUMNS.LOCATION_ID]: OutletProductMapping.outlet_id,
                    [LOCATION_CASE_QTY.COLUMNS.PRODUCT_CODE]: item.product_code,
                    [LOCATION_CASE_QTY.COLUMNS.CASE_QTY]: item.case_qty,
                    [LOCATION_CASE_QTY.COLUMNS.COMPANY_ID]: userDetails.company_id,
                    [LOCATION_CASE_QTY.COLUMNS.CREATED_BY]: userDetails.id,
                    [LOCATION_CASE_QTY.COLUMNS.CREATED_AT]: new Date(),
                };
            })
        );

        const inserted = await knex(LOCATION_CASE_QTY.NAME)
            .returning(LOCATION_CASE_QTY.COLUMNS.ID)
            .insert(insertData);

        // Insert into xl_import_log
        await knex(XL_IMPORT_LOG.NAME).insert({
            [XL_IMPORT_LOG.COLUMNS.XL_NAME]: "location case qty",
            [XL_IMPORT_LOG.COLUMNS.XL_DETAIL]: JSON.stringify(body),
            [XL_IMPORT_LOG.COLUMNS.COMPANY_ID]: userDetails.company_id,
            [XL_IMPORT_LOG.COLUMNS.CREATED_BY]: userDetails.id,
            [XL_IMPORT_LOG.COLUMNS.CREATED_AT]: new Date()
        });


        return {
            success: true,
            inserted_count: inserted.length
        };
    }


    async function getXlImportLogList({ params, logTrace, queryString }) {
        const knex = this;
        const { search, from_date, to_date } = queryString;

        const query = knex(XL_IMPORT_LOG.NAME)
            .select([
                `${XL_IMPORT_LOG.NAME}.*`,
                `${USERS.NAME}.${USERS.COLUMNS.USER_NAME}`
            ])
            .leftJoin(
                `${USERS.NAME} as ${USERS.NAME}`,
                `${XL_IMPORT_LOG.NAME}.${XL_IMPORT_LOG.COLUMNS.CREATED_BY}`,
                `${USERS.NAME}.${USERS.COLUMNS.ID}`
            )
        if (search) {
            query.where(XL_IMPORT_LOG.COLUMNS.XL_NAME, "ilike", `%${search}%`);
        }

        if (from_date) {
            query.whereRaw(`DATE(${XL_IMPORT_LOG.COLUMNS.CREATED_AT}) >= ?`, [from_date]);
        }

        if (to_date) {
            query.whereRaw(`DATE(${XL_IMPORT_LOG.COLUMNS.CREATED_AT}) <= ?`, [to_date]);
        }

        const response = await query.paginate({
            pageSize: params.page_size,
            currentPage: params.current_page
        });

        if (!response.data.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "XL Import Logs not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        return response;
    }



    return {
        postLocationCaseQty,
        getXlImportLogList
    };
}

module.exports = LocationCaseQtyRepo;