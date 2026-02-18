const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const xlsx = require('xlsx');

// Need Catalog DB Connection
function excelImportRepo(fastify) {
    async function uploadExcelData({ body }) {
        const file = body?.excelfile;
        if (!file) {
            throw CustomError.create({
                httpCode: StatusCodes.BAD_REQUEST,
                message: 'No file uploaded',
                property: 'excelfile',
                code: 'NO_FILE_UPLOADED'
            });
        }

        const buffer = await file.toBuffer();
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(sheet);
        const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        const headers = rows[0];

        return { headers, data: json };
    }

    return {
        uploadExcelData
    };
}

module.exports = excelImportRepo;
