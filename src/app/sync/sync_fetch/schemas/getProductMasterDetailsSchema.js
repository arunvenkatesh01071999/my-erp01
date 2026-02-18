const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getProductMasterDetailsSchema = {
    tags: ["PRODUCT MASTER"],
    summary: "This API fetches product master details",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            outlet_id: { type: "integer" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                status: { type: "string", enum: ["1", "0"] },
                message: {
                    oneOf: [
                        {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    prd_Clientid: { type: "string" },
                                    prd_id: { type: "string" },
                                    prd_code: { type: "string" },
                                    prd_Name: { type: "string" },
                                    prd_grp_id: { type: "string" },
                                    prd_uomid: { type: "string" },
                                    prd_sales_rate: { type: "string" },
                                    prd_name_tamil: { type: "string" },
                                    prd_barcode: { type: "string" },
                                    prd_ExpiryItem: { type: "string", enum: ["0", "1"] },
                                    brand: { type: "string" },
                                    vat: { type: "string" },
                                    uid: { type: "string" },
                                    create_time: { type: "string", format: "date-time" },
                                    web_active: { type: "string", enum: ["0", "1"] },
                                    web_name: { type: "string" },
                                    weighable: { type: "string", enum: ["0", "1"] },
                                    outlet_id: { type: "string" },
                                    pactive: { type: "string", enum: ["0", "1"] },
                                    mcid: { type: "string" },
                                    pitemoutlet: { type: ["null", "string"] },
                                    hsn: { type: "string" },
                                    Barcode1: { type: "string" },
                                    Barcode2: { type: "string" },
                                    Barcode3: { type: "string" },
                                    Barcode4: { type: "string" },
                                    Cess: { type: "string" },
                                    EditTime: { type: "string" },
                                    bcid: { type: "string" },
                                    Wid: { type: ["integer", "null"] },
                                    Prd_Type: { type: "string" },
                                    BatchNo: { type: "string" },
                                },
                                required: [
                                    "prd_Clientid",
                                    "prd_id",
                                    "prd_code",
                                    "prd_Name",
                                    "prd_grp_id",
                                    "prd_uomid",
                                    "prd_sales_rate",
                                    "prd_name_tamil",
                                    "prd_barcode",
                                    "prd_ExpiryItem",
                                    "brand",
                                    "vat",
                                    "uid",
                                    "create_time",
                                    "web_active",
                                    "web_name",
                                    "weighable",
                                    "outlet_id",
                                    "pactive",
                                    "mcid",
                                    "hsn",
                                    "Cess",
                                    "bcid",
                                    "Prd_Type",
                                    "BatchNo"
                                ],
                            },
                        },
                        {
                            type: "string"
                        }
                    ]

                },
            },
            required: ["status", "message"],
        },
        ...errorSchemas,
    },
};

module.exports = getProductMasterDetailsSchema;
