const receiptRepo = require("../repository/receipt");




function postreceiptService(fastify) {
  const { postreceipt } = receiptRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postreceipt.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });

    // const response = await updatePartyLedger.call(knex, {
    //   logTrace,
    //   input: { supplier_id },
    //   Debit: amount,
    //         Type: `Purchase - bill of docs number`,
    //         Credit: 0,
    //         Mode:''
    // });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getReceiptByPartyService(fastify) {
  const { getReceiptByParty } = receiptRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getReceiptByParty.call(knex, {
      params,
      logTrace
    });
    const transformedResponse = response.map(row => ({
      ...row,
      paid: row.outstanding,
      outstanding: row.amount - row.outstanding,

    }));

    return transformedResponse;
    // return response;
  };
}


function getReceiptDocnoService(fastify) {
  const { getReceiptDocno } = receiptRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getReceiptDocno.call(knex, {
      params,
      logTrace
    });

    return response;
  };
}


module.exports = {

  postreceiptService,
  getReceiptByPartyService,
  getReceiptDocnoService
};
