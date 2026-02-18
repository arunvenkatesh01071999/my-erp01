const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getProductMasterEditDetailsSchema = {
    tags: ["PRODUCT MASTER EDIT"],
    summary: "This API fetches product master edit details",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "object",
            properties: {
                status: { type: "string" },
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
                                    mode: { type: "string" },
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
                                    Wid: { type: ["number", "string"] },
                                    Prd_Type: { type: "string" },
                                    BatchNo: { type: "string" }
                                },
                                required: [
                                    "prd_Clientid",
                                    "prd_id",
                                    "prd_code",
                                    "prd_Name",
                                    "prd_grp_id",
                                    "prd_uomid",
                                    "mode",
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
                                    "pitemoutlet",
                                    "hsn",
                                    "Barcode1",
                                    "Barcode2",
                                    "Barcode3",
                                    "Barcode4",
                                    "Cess",
                                    "EditTime",
                                    "bcid",
                                    "Wid",
                                    "Prd_Type",
                                    "BatchNo"
                                ]
                            }
                        },
                        {
                            type: "string"
                        }
                    ]

                }
            },
            required: ["status", "message"]
        },
        ...errorSchemas
    }
};

module.exports = getProductMasterEditDetailsSchema;
