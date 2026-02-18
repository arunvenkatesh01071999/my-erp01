const getOutletSalesReturnMasterServices = require("../services/getOutletSalesReturnMasterServices");

function updateOsmBycashBillHandler(fastify) {
  const updateOsmBycashBill = getOutletSalesReturnMasterServices.updateOsmBycashBillService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await updateOsmBycashBill({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = updateOsmBycashBillHandler;
