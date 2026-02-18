const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const excelImportStatusType = {
    tags: ["Item"],
    summary: "This API is to  Excel Import Status",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    type_name: { type: "string" }
                }
            }
        }
    }
}

module.exports = excelImportStatusType;