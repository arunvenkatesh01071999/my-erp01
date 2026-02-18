const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

// const expenceLedgerDayReportSchema = {
//   tags: ["Expense Ledger"],
//   summary: "Expense ledger day report schema",
//   response: {
//     200: {
//       type: "array",
//       items: {
//         type: "object",
//         properties: {
//           month: { type: "string" },
//           month_number: { type: "string" },
//           year: { type: "string" },
//           no_of_acc_id: { type: "string" },
//           amount: { type: "string" }
//         }
//       }
//     }
//   }
// };

const expenceLedgerDayReportSchema = {
  tags: ["Expense Ledger"],
  summary: "Expense ledger schema",
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              edate: { type: "string", format: "date-time" },
              accid: { type: "integer" },
              amount: { type: "string" },
              company_id: { type: "integer" },
              created_at: { type: "string", format: "date-time" },
              updated_at: { type: "string", format: "date-time" },
              created_by: { type: "integer" },
              updated_by: { type: ["integer", "null"] },
              account_name: { type: "string" }
            }
          }
        },
        meta: {
          type: "object",
          properties: {
            pagination: {
              type: "object",
              properties: {
                total: { type: "integer" },
                page: { type: "integer" },
                page_size: { type: "string" },
                total_pages: { type: "integer" }
              }
            }
          }
        }
      }
    }
  }
};



module.exports = expenceLedgerDayReportSchema;


