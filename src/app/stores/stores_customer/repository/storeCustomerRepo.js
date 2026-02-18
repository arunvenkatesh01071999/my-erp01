const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const {
    STORES_CUSTOMER,
    STORES_CUSTOMER_LOGS,
    STORES_CUSTOMER_MAPPING
} = require("../commons/constants")
const _ = require("lodash");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants")



function storeCustomerRepo(fastify) {

    async function postStoreCustomerRepo({ params, body, logTrace, userDetails }) {
        const knex = this;

        const response = await knex.transaction(async (trx) => {
            try {
                const exists_response = await trx(STORES_CUSTOMER.NAME)
                    .where(STORES_CUSTOMER.COLUMNS.NAME, body.customer_name);

                if (exists_response.length > 0) {
                    throw CustomError.create({
                        httpCode: StatusCodes.NOT_ACCEPTABLE,
                        message: "Customer Name Already Exists",
                        property: "",
                        code: "NOT_ACCEPTABLE"
                    });
                }

                const exists_customer_code = await trx(STORES_CUSTOMER.NAME)
                    .select(`${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.CUSTOMER_CODE}`)
                    .limit(1)
                    .orderBy(STORES_CUSTOMER.COLUMNS.ID, "DESC");

                let customer_code;

                if (exists_customer_code.length === 0) {
                    customer_code = "CUS0001";
                } else {
                    // Get last STORES_CUSTOMER code like 'B0034'
                    const lastCode = exists_customer_code[0].customer_code;

                    // Extract the numeric part (e.g. 34)
                    const numericPart = parseInt(lastCode.slice(1), 10);
                    // Increment it
                    const nextNumber = numericPart + 1;
                    console.log(nextNumber, "nextNumber");
                    // Add leading zeros (e.g. 35 → '0035')
                    const nextCode = "CUS" + String(nextNumber).padStart(4, "0");

                    customer_code = nextCode;
                }

                console.log("Next STORES_CUSTOMER Code:", customer_code);

                const [storeCustomerResponse] = await trx(STORES_CUSTOMER.NAME)
                    .returning(STORES_CUSTOMER.COLUMNS.ID)
                    .insert({
                        [STORES_CUSTOMER.COLUMNS.NAME]: body.customer_name,
                        [STORES_CUSTOMER.COLUMNS.SHORT_NAME]: body.short_name,
                        [STORES_CUSTOMER.COLUMNS.CUSTOMER_CODE]: customer_code,

                        [STORES_CUSTOMER.COLUMNS.GROUP_ID]: body.group_id,
                        [STORES_CUSTOMER.COLUMNS.ALLOCATE_GROUP]: body.allocate_group,

                        [STORES_CUSTOMER.COLUMNS.ADDRESS1]: body.address1,
                        [STORES_CUSTOMER.COLUMNS.ADDRESS2]: body.address2,

                        [STORES_CUSTOMER.COLUMNS.COUNTRY_ID]: body.country,
                        [STORES_CUSTOMER.COLUMNS.STATE_ID]: body.state,
                        [STORES_CUSTOMER.COLUMNS.CITY_ID]: body.city,
                        [STORES_CUSTOMER.COLUMNS.STATE_CODE]: body.state_code,

                        [STORES_CUSTOMER.COLUMNS.PINCODE]: body.pincode,

                        [STORES_CUSTOMER.COLUMNS.PHONE]: body.phone,
                        [STORES_CUSTOMER.COLUMNS.MOBILE]: body.mobile,

                        [STORES_CUSTOMER.COLUMNS.EMAIL]: body.email,
                        [STORES_CUSTOMER.COLUMNS.WEBSITE]: body.website,

                        [STORES_CUSTOMER.COLUMNS.GSTIN]: body.gstin,
                        [STORES_CUSTOMER.COLUMNS.CST]: body.cst,
                        [STORES_CUSTOMER.COLUMNS.PAN_NUMBER]: body.pan_number,

                        [STORES_CUSTOMER.COLUMNS.OPENING_BALANCE]: Number(body.opening_balance) || 0,
                        [STORES_CUSTOMER.COLUMNS.BALANCE]: Number(body.balance) || 0,

                        [STORES_CUSTOMER.COLUMNS.WEB_ID]: body.web_id,
                        [STORES_CUSTOMER.COLUMNS.LOCATION_ID]: body.location_id,
                        [STORES_CUSTOMER.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,

                        [STORES_CUSTOMER.COLUMNS.EXPORT]: Number(body.export) || 0,
                        [STORES_CUSTOMER.COLUMNS.SALES_MARGIN]: Number(body.sales_margin) || 0,

                        [STORES_CUSTOMER.COLUMNS.CUSTOMER_TYPE]: body.customer_type,
                        [STORES_CUSTOMER.COLUMNS.GST_TYPE]: body.gst_type,

                        [STORES_CUSTOMER.COLUMNS.DEFAULT_CASH_SALES]: body.default_cash_sales,
                        [STORES_CUSTOMER.COLUMNS.WEB_ORDER]: body.web_order,
                        [STORES_CUSTOMER.COLUMNS.WEB_SALES_EXPORT]: body.web_sales_export,
                        [STORES_CUSTOMER.COLUMNS.BULK_SALES]: body.bulk_sales,
                        [STORES_CUSTOMER.COLUMNS.GROCERY_TRAY]: body.grocery_tray,
                        [STORES_CUSTOMER.COLUMNS.MARGIN_ACTIVE]: body.margin_active,

                        [STORES_CUSTOMER.COLUMNS.DELIVERY_ADDRESS1]: body.delivery_address1,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_ADDRESS2]: body.delivery_address2,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_COUNTRY_ID]: body.delivery_country_id,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_STATE_ID]: body.delivery_state_id,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_CITY_ID]: body.delivery_city_id,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_PINCODE]: body.delivery_pincode,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_STATE_PINCODE]: body.delivery_state_code,

                        [STORES_CUSTOMER.COLUMNS.STATUS]: body.status,
                        [STORES_CUSTOMER.COLUMNS.IS_ACTIVE]: body.is_active ?? true,

                        [STORES_CUSTOMER.COLUMNS.COMPANY_ID]: body.company_id,
                        [STORES_CUSTOMER.COLUMNS.USER_ID]: userDetails.id,
                        [STORES_CUSTOMER.COLUMNS.WH_ID]: body.wh_id,

                        [STORES_CUSTOMER.COLUMNS.CREATED_BY]: userDetails.id,
                        [STORES_CUSTOMER.COLUMNS.CREATED_AT]: new Date()
                    });


                const stores_customer_id = storeCustomerResponse.id;

                const { outlets } = body;

                if (Array.isArray(outlets) && outlets.length > 0) {
                    const outletsDetails = outlets.map(outlet => ({
                        [STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_CODE]: customer_code,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_NAME]: body.customer_name || 1,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.ADDRESS1]: body.address1 || 1,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.ADDRESS2]: body.address2 || 1,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.COUNTRY_ID]: body.country,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.STATE_ID]: body.state,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.CITY_ID]: body.city,

                        [STORES_CUSTOMER_MAPPING.COLUMNS.PINCODE]: body.pincode,

                        [STORES_CUSTOMER_MAPPING.COLUMNS.PHONE]: body.phone,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.MOBILE]: body.mobile,

                        [STORES_CUSTOMER_MAPPING.COLUMNS.EMAIL]: body.email,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.OPENING_BALANCE]: Number(body.opening_balance) || 0,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.BALANCE]: Number(body.balance) || 0,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_TYPE]: body.customer_type,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.GST_TYPE]: body.gst_type,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.GSTIN]: body.gstin,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.PAN_NUMBER]: body.pan_number,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.COMPANY_ID]: body.company_id || 1,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.OUTLET_ID]: outlet.outlet_id,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_ID]: stores_customer_id,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.COMPANY_ID]: body.company_id || 1,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.WH_ID]: body.wh_id || 1,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
                        [STORES_CUSTOMER_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id
                    }));
                    await trx(STORES_CUSTOMER_MAPPING.NAME).insert(outletsDetails);
                }

                await trx(STORES_CUSTOMER_LOGS.NAME).insert({
                    [STORES_CUSTOMER_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
                    [STORES_CUSTOMER_LOGS.COLUMNS.USER_ID]: userDetails.id,
                    [STORES_CUSTOMER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
                    [STORES_CUSTOMER_LOGS.COLUMNS.CUSTOMER_ID]: stores_customer_id,
                    [STORES_CUSTOMER_LOGS.COLUMNS.CUSTOMER_NAME]: String(body.customer_name).trim()
                });

                return { success: true };
            } catch (error) {
                console.log("Transaction Error:", error);

                if (error instanceof CustomError || error?._code) {
                    throw error;
                }

                throw CustomError.create({
                    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Failed to create STORES_CUSTOMER.",
                    property: "",
                    code: "STORES_CUSTOMER_CREATION_FAILED"
                });
            }


        });

        return response;
    }

    async function putStoreCustomerRepo({ params, body, logTrace, userDetails }) {
        const knex = this;
        const { customer_id } = params;

        return knex.transaction(async (trx) => {
            try {

                const existingCustomer = await trx(STORES_CUSTOMER.NAME)
                    .where(STORES_CUSTOMER.COLUMNS.ID, customer_id)
                    .first();

                if (!existingCustomer) {
                    throw CustomError.create({
                        httpCode: StatusCodes.NOT_FOUND,
                        message: "Customer not found",
                        code: "CUSTOMER_NOT_FOUND"
                    });
                }

                const duplicateName = await trx(STORES_CUSTOMER.NAME)
                    .where(STORES_CUSTOMER.COLUMNS.NAME, body.customer_name)
                    .whereNot(STORES_CUSTOMER.COLUMNS.ID, customer_id)
                    .first();

                if (duplicateName) {
                    throw CustomError.create({
                        httpCode: StatusCodes.NOT_ACCEPTABLE,
                        message: "Customer Name Already Exists",
                        code: "NOT_ACCEPTABLE"
                    });
                }

                await trx(STORES_CUSTOMER.NAME)
                    .where(STORES_CUSTOMER.COLUMNS.ID, customer_id)
                    .update({
                        [STORES_CUSTOMER.COLUMNS.NAME]: body.customer_name,
                        [STORES_CUSTOMER.COLUMNS.SHORT_NAME]: body.short_name,
                        [STORES_CUSTOMER.COLUMNS.GROUP_ID]: body.group_id,
                        [STORES_CUSTOMER.COLUMNS.ALLOCATE_GROUP]: body.allocate_group,
                        [STORES_CUSTOMER.COLUMNS.ADDRESS1]: body.address1,
                        [STORES_CUSTOMER.COLUMNS.ADDRESS2]: body.address2,
                        [STORES_CUSTOMER.COLUMNS.COUNTRY_ID]: body.country,
                        [STORES_CUSTOMER.COLUMNS.STATE_ID]: body.state,
                        [STORES_CUSTOMER.COLUMNS.CITY_ID]: body.city,
                        [STORES_CUSTOMER.COLUMNS.PINCODE]: body.pincode,
                        [STORES_CUSTOMER.COLUMNS.STATE_CODE]: body.state_code,
                        [STORES_CUSTOMER.COLUMNS.PHONE]: body.phone,
                        [STORES_CUSTOMER.COLUMNS.MOBILE]: body.mobile,
                        [STORES_CUSTOMER.COLUMNS.EMAIL]: body.email,
                        [STORES_CUSTOMER.COLUMNS.WEBSITE]: body.website,
                        [STORES_CUSTOMER.COLUMNS.GSTIN]: body.gstin,
                        [STORES_CUSTOMER.COLUMNS.CST]: body.cst,
                        [STORES_CUSTOMER.COLUMNS.PAN_NUMBER]: body.pan_number,
                        [STORES_CUSTOMER.COLUMNS.OPENING_BALANCE]: Number(body.opening_balance) || 0,
                        [STORES_CUSTOMER.COLUMNS.BALANCE]: Number(body.balance) || 0,
                        [STORES_CUSTOMER.COLUMNS.WEB_ID]: body.web_id,
                        [STORES_CUSTOMER.COLUMNS.LOCATION_ID]: body.location_id,
                        [STORES_CUSTOMER.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
                        [STORES_CUSTOMER.COLUMNS.EXPORT]: Number(body.export) || 0,
                        [STORES_CUSTOMER.COLUMNS.SALES_MARGIN]: Number(body.sales_margin) || 0,
                        [STORES_CUSTOMER.COLUMNS.CUSTOMER_TYPE]: body.customer_type,
                        [STORES_CUSTOMER.COLUMNS.GST_TYPE]: body.gst_type,
                        [STORES_CUSTOMER.COLUMNS.DEFAULT_CASH_SALES]: body.default_cash_sales,
                        [STORES_CUSTOMER.COLUMNS.WEB_ORDER]: body.web_order,
                        [STORES_CUSTOMER.COLUMNS.WEB_SALES_EXPORT]: body.web_sales_export,
                        [STORES_CUSTOMER.COLUMNS.BULK_SALES]: body.bulk_sales,
                        [STORES_CUSTOMER.COLUMNS.GROCERY_TRAY]: body.grocery_tray,
                        [STORES_CUSTOMER.COLUMNS.MARGIN_ACTIVE]: body.margin_active,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_ADDRESS1]: body.delivery_address1,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_ADDRESS2]: body.delivery_address2,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_COUNTRY_ID]: body.delivery_country_id,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_STATE_ID]: body.delivery_state_id,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_CITY_ID]: body.delivery_city_id,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_PINCODE]: body.delivery_pincode,
                        [STORES_CUSTOMER.COLUMNS.DELIVERY_STATE_PINCODE]: body.delivery_state_code,
                        [STORES_CUSTOMER.COLUMNS.STATUS]: body.status,
                        [STORES_CUSTOMER.COLUMNS.IS_ACTIVE]: body.is_active ?? true,
                        [STORES_CUSTOMER.COLUMNS.UPDATED_BY]: userDetails.id,
                        [STORES_CUSTOMER.COLUMNS.UPDATED_AT]: new Date()
                    });

                if (Array.isArray(body.outlets)) {
                    for (const outlet of body.outlets) {
                        const existsMapping = await trx(STORES_CUSTOMER_MAPPING.NAME)
                            .where({
                                [STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_ID]: customer_id,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.OUTLET_ID]: outlet.outlet_id
                            })
                            .first();

                        if (existsMapping) {
                            await trx(STORES_CUSTOMER_MAPPING.NAME)
                                .where(STORES_CUSTOMER_MAPPING.COLUMNS.ID, existsMapping.id)
                                .update({
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_NAME]: body.customer_name,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.ADDRESS1]: body.address1,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.ADDRESS2]: body.address2,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.COUNTRY_ID]: body.country,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.STATE_ID]: body.state,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.CITY_ID]: body.city,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_TYPE]: body.customer_type,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.GST_TYPE]: body.gst_type,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.GSTIN]: body.gstin,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.PAN_NUMBER]: body.pan_number,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.COMPANY_ID]: body.company_id || 1,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.PINCODE]: body.pincode,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.PHONE]: body.phone,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.MOBILE]: body.mobile,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.EMAIL]: body.email,
                                    [STORES_CUSTOMER_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id
                                });
                        } else {
                            await trx(STORES_CUSTOMER_MAPPING.NAME).insert({
                                [STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_ID]: customer_id,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_CODE]: existingCustomer.customer_code,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_NAME]: body.customer_name,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.ADDRESS1]: body.address1,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.ADDRESS2]: body.address2,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.COUNTRY_ID]: body.country,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.STATE_ID]: body.state,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.CITY_ID]: body.city,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.PINCODE]: body.pincode,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.PHONE]: body.phone,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.MOBILE]: body.mobile,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.EMAIL]: body.email,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.OPENING_BALANCE]: Number(body.opening_balance) || 0,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.BALANCE]: Number(body.balance) || 0,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_TYPE]: body.customer_type,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.GST_TYPE]: body.gst_type,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.GSTIN]: body.gstin,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.PAN_NUMBER]: body.pan_number,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.COMPANY_ID]: body.company_id || 1,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.OUTLET_ID]: outlet.outlet_id,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.WH_ID]: body.wh_id,
                                [STORES_CUSTOMER_MAPPING.COLUMNS.CREATED_BY]: userDetails.id
                            });
                        }
                    }
                }

                await trx(STORES_CUSTOMER_LOGS.NAME).insert({
                    [STORES_CUSTOMER_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
                    [STORES_CUSTOMER_LOGS.COLUMNS.USER_ID]: userDetails.id,
                    [STORES_CUSTOMER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
                    [STORES_CUSTOMER_LOGS.COLUMNS.CUSTOMER_ID]: customer_id,
                    [STORES_CUSTOMER_LOGS.COLUMNS.CUSTOMER_NAME]: body.customer_name
                });

                return { success: true };
            } catch (error) {
                console.log("Transaction Error:", error);

                if (error instanceof CustomError || error?._code) {
                    throw error;
                }

                throw CustomError.create({
                    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Failed to update STORES_CUSTOMER",
                    code: "STORES_CUSTOMER_UPDATE_FAILED"
                });
            }
        });
    }

    async function deleteCustomerRepo({ customer_id, body, logTrace, userDetails }) {
        const knex = this;
        const existscustomerquery = knex(STORES_CUSTOMER.NAME).
            where(STORES_CUSTOMER.COLUMNS.ID, customer_id);

        const exists_response = await existscustomerquery;

        if (!exists_response.length > 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_ACCEPTABLE,
                message: "Customer not found to delete",
                property: "",
                code: "NOT_ACCEPTABLE"
            });
        }

        const validationquery = knex(PURCHASE_ORDER_MASTER.NAME).
            where(PURCHASE_ORDER_MASTER.COLUMNS.SUPPLIER_ID, customer_id);

        const exists_response1 = await validationquery;
        console.log(exists_response1)
        if (exists_response1.length > 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_ACCEPTABLE,
                message: "Cannot delete customer,Associated with a sales.",
                property: "",
                code: "NOT_ACCEPTABLE"
            });
        }

        const query = knex(STORES_CUSTOMER.NAME)
            .where(STORES_CUSTOMER.COLUMNS.ID, customer_id)
            .del();
        logQuery({
            logger: fastify.log,
            query,
            context: "delete customer",
            logTrace
        });
        const response = await query;
        if (!response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Customer not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        await knex(STORES_CUSTOMER_MAPPING.NAME)
            .where(STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_ID, customer_id)
            .del();

        await knex(STORES_CUSTOMER_LOGS.NAME).insert({
            [STORES_CUSTOMER_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
            [STORES_CUSTOMER_LOGS.COLUMNS.USER_ID]: userDetails.id,
            [STORES_CUSTOMER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
            [STORES_CUSTOMER_LOGS.COLUMNS.CUSTOMER_ID]: customer_id,
            [STORES_CUSTOMER_LOGS.COLUMNS.CUSTOMER_NAME]: String(exists_response[0].name).trim()
        });

        return { success: true };
    }

    async function getCustomerInfoRepo({ params, logTrace }) {
        const knex = this;

        const query = knex
            .select([
                `${STORES_CUSTOMER.NAME}.*`,
                `state.name as state_name`,
                `city.name as city_name`,
                `country.name as country_name`,
                `delivery_state.name as delivery_state_name`,
                `delivery_city.name as delivery_city_name`,
                `delivery_country.name as delivery_country_name`
            ])
            .from(`${STORES_CUSTOMER.NAME} as ${STORES_CUSTOMER.NAME}`)

            // Billing address
            .leftJoin(
                `${STATES.NAME} as state`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.STATE_ID}`,
                `state.${STATES.COLUMNS.ID}`
            )
            .leftJoin(
                `${CITIES.NAME} as city`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.CITY_ID}`,
                `city.${CITIES.COLUMNS.ID}`
            )
            .leftJoin(
                `${COUNTRIES.NAME} as country`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.COUNTRY_ID}`,
                `country.${COUNTRIES.COLUMNS.ID}`
            )

            // Delivery address
            .leftJoin(
                `${STATES.NAME} as delivery_state`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.DELIVERY_STATE_ID}`,
                `delivery_state.${STATES.COLUMNS.ID}`
            )
            .leftJoin(
                `${CITIES.NAME} as delivery_city`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.DELIVERY_CITY_ID}`,
                `delivery_city.${CITIES.COLUMNS.ID}`
            )
            .leftJoin(
                `${COUNTRIES.NAME} as delivery_country`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.DELIVERY_COUNTRY_ID}`,
                `delivery_country.${COUNTRIES.COLUMNS.ID}`
            )

            .where(
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.ID}`,
                params.customer_id
            );

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Customer Info",
            logTrace
        });

        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Customer not found",
                code: "NOT_FOUND"
            });
        }

        return response[0];
    }

    async function getCustomerRepo({ logTrace }) {
        const knex = this;

        const query = knex
            .select([
                `${STORES_CUSTOMER.NAME}.*`,
                `state.name as state_name`,
                `city.name as city_name`,
                `country.name as country_name`,
                `delivery_state.name as delivery_state_name`,
                `delivery_city.name as delivery_city_name`,
                `delivery_country.name as delivery_country_name`
            ])
            .from(`${STORES_CUSTOMER.NAME} as ${STORES_CUSTOMER.NAME}`)

            // Billing address
            .leftJoin(
                `${STATES.NAME} as state`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.STATE_ID}`,
                `state.${STATES.COLUMNS.ID}`
            )
            .leftJoin(
                `${CITIES.NAME} as city`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.CITY_ID}`,
                `city.${CITIES.COLUMNS.ID}`
            )
            .leftJoin(
                `${COUNTRIES.NAME} as country`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.COUNTRY_ID}`,
                `country.${COUNTRIES.COLUMNS.ID}`
            )

            // Delivery address
            .leftJoin(
                `${STATES.NAME} as delivery_state`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.DELIVERY_STATE_ID}`,
                `delivery_state.${STATES.COLUMNS.ID}`
            )
            .leftJoin(
                `${CITIES.NAME} as delivery_city`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.DELIVERY_CITY_ID}`,
                `delivery_city.${CITIES.COLUMNS.ID}`
            )
            .leftJoin(
                `${COUNTRIES.NAME} as delivery_country`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.DELIVERY_COUNTRY_ID}`,
                `delivery_country.${COUNTRIES.COLUMNS.ID}`
            )
            .orderBy(STORES_CUSTOMER.COLUMNS.ID, "DESC");

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Customer",
            logTrace
        });

        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Customer not found",
                code: "NOT_FOUND"
            });
        }
        console.log('responseeee', response);


        return response;
    }

    async function getCustomerPaginateRepo({ queryString, params, logTrace }) {
        const knex = this;
        const { status, search } = queryString;
        const query = knex
            .select([
                `${STORES_CUSTOMER.NAME}.*`,
                knex.raw(
                    `jsonb_build_object('id', ${STATES.NAME}.${STATES.COLUMNS.ID}, 'name', ${STATES.NAME}.${STATES.COLUMNS.NAME}) as state`
                ),
                knex.raw(
                    `jsonb_build_object('id', ${CITIES.NAME}.${CITIES.COLUMNS.ID}, 'name', ${CITIES.NAME}.${CITIES.COLUMNS.NAME}) as city`
                ),
                knex.raw(
                    `jsonb_build_object('id', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}, 'name', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}) as country`
                )
            ])
            .from(`${STORES_CUSTOMER.NAME} as ${STORES_CUSTOMER.NAME}`)
            .leftJoin(
                `${STATES.NAME} as ${STATES.NAME}`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.STATE_ID}`,
                `${STATES.NAME}.${STATES.COLUMNS.ID}`
            )
            .leftJoin(
                `${CITIES.NAME} as ${CITIES.NAME}`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.CITY_ID}`,
                `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
            )
            .leftJoin(
                `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.COUNTRY_ID}`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
            )
            .orderBy(STORES_CUSTOMER.COLUMNS.ID, "DESC");

        if (Number(status) && Number(status) == 1) {
            query.where(
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.IS_ACTIVE}`,
                true
            );
        }

        if (Number(status) && Number(status) == 2) {
            query.where(
                `${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.IS_ACTIVE}`,
                false
            );
        }

        if (search && search.length >= 2) {
            query.where(function () {
                this.where(`${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.NAME}`, "ilike", `%${search}%`)
                    .orWhere(`${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.SHORT_NAME}`, "ilike", `%${search}%`)
                    .orWhere(`${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.MOBILE}`, "ilike", `%${search}%`)
                    .orWhere(`${STORES_CUSTOMER.NAME}.${STORES_CUSTOMER.COLUMNS.PHONE}`, "ilike", `%${search}%`)
            });
        }
        logQuery({
            logger: fastify.log,
            query,
            context: "Get Customer",
            logTrace
        });
        const response = await query.paginate({
            pageSize: params.page_size,
            currentPage: params.current_page
        });
        if (!response.data.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Customer not found",
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

        const finalResponse = await Promise.all(
            response.data.map(async customer => {
                const outlets = await knex
                    .select([
                        `${OUTLETS.NAME}.*`
                    ])
                    .from(`${STORES_CUSTOMER_MAPPING.NAME} as ${STORES_CUSTOMER_MAPPING.NAME}`)
                    .leftJoin(
                        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                        `${STORES_CUSTOMER_MAPPING.NAME}.${STORES_CUSTOMER_MAPPING.COLUMNS.OUTLET_ID}`,
                        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
                    )
                    .where(
                        `${STORES_CUSTOMER_MAPPING.NAME}.${STORES_CUSTOMER_MAPPING.COLUMNS.IS_ACTIVE}`,
                        true
                    )
                    .where(
                        `${STORES_CUSTOMER_MAPPING.NAME}.${STORES_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_ID}`,
                        customer.id
                    );

                return {
                    ...customer,
                    customer_creation_date: new Date(customer.created_at).toISOString().split("T")[0],
                    outlets,
                };
            })
        );
        return {
            data: finalResponse,
            meta: response.meta
        };
    }

    return {

        postStoreCustomerRepo,
        putStoreCustomerRepo,
        deleteCustomerRepo,
        getCustomerInfoRepo,
        getCustomerRepo,
        getCustomerPaginateRepo

    };
}
module.exports = storeCustomerRepo
