const outletSalesRepo = require("../repository/outletSales.js");
const email = require("../../../../notification/repository/currentSalesMail.js");

function outletSalesOutletWiseCurrentDateReportService(fastify) {
  const { outletSalesOutletWiseCurrentDateReport } = outletSalesRepo(fastify);
  // const { sendCurrentSalesEmailNotification } = email(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await outletSalesOutletWiseCurrentDateReport.call(knex, {
      body,
      params,
      logTrace,
      queryString: query
    });
    console.log(response.outletSales.length)

    return response;

    // if (response.outletSales.length > 0) {

    //   await sendCurrentSalesEmailNotification(response);

    // }

    // return {
    //   success: true,
    //   message: "Mail sent successfully"
    // };


  }
}
function getOutletSalesReportService(fastify) {
  const { getOutletSalesReport } = outletSalesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletSalesReport.call(knex, {
      body,
      params,
      logTrace
    });
    const transformedResponse = await Promise.all(
      response.map(item => ({
        final_total:
          (Number(item.amount) || 0) +
          (Number(item.less_amount) || 0) +
          (Number(item.return_amount) || 0) +
          (Number(item.loyalty_redem) || 0),
        ...item,
      }))
    )
    return transformedResponse;
  }
}
function getOutletSalesItemwiseReportService(fastify) {
  const { getOutletSalesItemwiseReport } = outletSalesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletSalesItemwiseReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}
function getOutletSalesBranchwisePhysicalStockReportService(fastify) {
  const { getOutletSalesBranchwisePhysicalStockReport } = outletSalesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletSalesBranchwisePhysicalStockReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}
function getOutletSalesItemwiseBreakupReportService(fastify) {
  const { getOutletSalesItemwiseBreakupReport } = outletSalesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletSalesItemwiseBreakupReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

function getOutletSalesBranchwiseReportService(fastify) {
  const { getOutletSalesBranchwiseReport } = outletSalesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletSalesBranchwiseReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}
function outletSalesItemWiseAllReportService(fastify) {
  const { outletSalesItemWiseAllReport } = outletSalesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await outletSalesItemWiseAllReport.call(knex, {
      body,
      params,
      logTrace
    });
    const transformedResponse = transformSalesData(response);

    return transformedResponse;

  };
}
function transformSalesData(salesData) {
  const transformedData = {};

  salesData.forEach(item => {
    const { category_name, subcategory_name, type_name, head_name, prodid, pro_code, pro_name, outlet_code, outlet_name, qty, amount } = item;

    if (!transformedData[prodid]) {
      transformedData[prodid] = {
        category_name,
        subcategory_name,
        type_name,
        head_name,
        prodid,
        pro_code,
        pro_name,
        total_qty: 0,
        total_amount: 0,
        outlet_details: []
      };
    }

    transformedData[prodid].total_qty += parseFloat(qty);
    transformedData[prodid].total_amount += parseFloat(amount);

    transformedData[prodid].outlet_details.push({
      outlet_id: prodid, // Assuming outlet_id is the same as prodid
      outlet_code,
      outlet_name,
      qty: parseFloat(qty),
      amount: parseFloat(amount)
    });
  });
  // Extract distinct outlets
  const distinctOutlets = Object.values(transformedData)
    .reduce((acc, category) => {
      category.outlet_details.forEach(outlet => {
        if (!acc[outlet.outlet_code]) {
          acc[outlet.outlet_code] = {
            outlet_code: outlet.outlet_code,
            outlet_name: outlet.outlet_name
          };
        }
      });
      return acc;
    }, {});

  // Prepare the output
  const output = Object.values(transformedData);

  return [{ outlets_names_header: Object.values(distinctOutlets) }, ...output];

  // return Object.values(transformedData);
}
function getOutletSalesGroupwiseAllReportService(fastify) {
  const { getOutletSalesGroupwiseAllReport } = outletSalesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletSalesGroupwiseAllReport.call(knex, {
      body,
      params,
      logTrace
    });
    const transformedResponse = transformSalesDataCategoryAndOutletWise(response);

    return transformedResponse;
    // return response;

  };
}

function transformSalesDataCategoryAndOutletWise(salesData) {
  const transformedData = {};


  salesData.forEach(item => {
    const { category_name, subcategory_name, type_name, head_name, qty, amount, outlet_code, outlet_name } = item;

    if (!transformedData[category_name]) {
      transformedData[category_name] = {
        category_name,
        subcategory_name,
        type_name,
        head_name,
        total_qty: 0,
        total_amount: 0,
        outlet_details: {}
      };
    }


    transformedData[category_name].total_qty += parseFloat(qty);
    transformedData[category_name].total_amount += parseFloat(amount);

    if (!transformedData[category_name].outlet_details[outlet_code]) {
      transformedData[category_name].outlet_details[outlet_code] = {
        outlet_code,
        outlet_name,
        total_qty: 0,
        total_amount: 0
      };
    }

    transformedData[category_name].outlet_details[outlet_code].total_qty += parseFloat(qty);
    transformedData[category_name].outlet_details[outlet_code].total_amount += parseFloat(amount);
  });

  // Convert outlet_details object to array
  Object.values(transformedData).forEach(category => {
    category.outlet_details = Object.values(category.outlet_details);
  });

  // Extract distinct outlets
  const distinctOutlets = Object.values(transformedData)
    .reduce((acc, category) => {
      category.outlet_details.forEach(outlet => {
        if (!acc[outlet.outlet_code]) {
          acc[outlet.outlet_code] = {
            outlet_code: outlet.outlet_code,
            outlet_name: outlet.outlet_name
          };
        }
      });
      return acc;
    }, {});

  // Prepare the output
  const output = Object.values(transformedData);

  return [{ outlets_names_header: Object.values(distinctOutlets) }, ...output];

}
// function outletSalesOverviewService(fastify) {
//   const { outletSalesOverview } = outletSalesRepo(fastify);

//   return async ({ body, params, logTrace }) => {
//     const knex = fastify.knexMedical;
//     const response = await outletSalesOverview.call(knex, {
//       body,
//       params,
//       logTrace
//     });


//     // // Transform total_sales
//     // response.total_sales =
//     //   response.total_card +
//     //   response.total_cash +
//     //   response.total_upi -
//     //   response.total_return_used -
//     //   response.total_loyalty;

//     // return response;

//     // console.log("total_return_by_cash" + response.total_return_by_cash);
//     // console.log("total_return_cash_count" + response.total_return_cash_count);
//     console.log("total_loyalty_upi" + response.total_loyalty_upi);
//     console.log("total_loyalty_cash" + response.total_loyalty_cash);
//     console.log("total_loyalty_mixed" + response.total_loyalty_mixed);
//     console.log("total_loyalty_card" + response.total_loyalty_card);
//     console.log("less_amount_cash" + response.less_amount_cash);
//     console.log("less_amount_card" + response.less_amount_card);
//     console.log("less_amount_upi" + response.less_amount_upi);
//     console.log("less_amount_mixed" + response.less_amount_mixed);
//     console.log("total_less_amount" + response.total_less_amount);



//     return {
//       total_sales: parseFloat(response.total_card) +
//         parseFloat(response.total_cash) +
//         parseFloat(response.total_upi) + parseFloat(response.total_loyalty) + parseFloat(response.total_less_amount),
//       // parseFloat(response.total_return_used) -
//       // parseFloat(response.total_return_by_cash) -
//       // parseFloat(response.total_loyalty),
//       total_invoices: response.total_invoices,
//       total_card: parseFloat(response.total_card),
//       total_cash: parseFloat(response.total_cash) - parseFloat(response.total_return_used),
//       total_upi: parseFloat(response.total_upi),
//       // total_card: parseFloat(response.total_card) - parseFloat(response.total_loyalty_card) - parseFloat(response.less_amount_card),
//       // total_cash: parseFloat(response.total_cash) - parseFloat(response.total_loyalty_card) - parseFloat(response.total_loyalty_mixed) - parseFloat(response.less_amount_card) - parseFloat(response.less_amount_mixed),
//       // total_upi: parseFloat(response.total_upi) - parseFloat(response.total_loyalty_upi) - parseFloat(response.less_amount_upi), 
//       total_return: response.total_return,
//       total_return_used: parseFloat(response.total_return_used) + parseFloat(response.total_return_by_cash),
//       total_loyalty: response.total_loyalty,
//       total_return_count: parseFloat(response.total_return_count) + parseFloat(response.total_return_cash_count),
//       total_less_amount: response.total_less_amount
//     };

//   };
// }
function outletSalesOverviewService(fastify) {
  const { outletSalesOverview, getCashCloseDenominatonByDate } = outletSalesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;

    const response = await outletSalesOverview.call(knex, {
      body,
      params,
      logTrace
    });

    const dinominationDetails = await getCashCloseDenominatonByDate.call(knex, {
      body,
      params,
      logTrace
    });

    return {
      total_sales: parseFloat(response.total_card || 0) +
        parseFloat(response.total_cash || 0) +
        parseFloat(response.total_upi || 0) +
        parseFloat(response.total_loyalty || 0) +
        parseFloat(response.total_less_amount || 0) + parseFloat(response.total_return_used || 0),
      total_invoices: response.total_invoices,
      total_card: parseFloat(response.total_card || 0),
      total_cash: parseFloat(response.total_cash || 0) - parseFloat(response.total_return_by_cash || 0),
      total_upi: parseFloat(response.total_upi || 0),
      total_return: response.total_return,
      total_return_used: parseFloat(response.total_return_used || 0) + parseFloat(response.total_return_by_cash || 0),
      total_loyalty: response.total_loyalty,
      total_return_count: parseFloat(response.total_return_count || 0) + parseFloat(response.total_return_cash_count || 0),
      total_less_amount: response.total_less_amount,
      dinominationDetails: dinominationDetails
    };
  };
}

function outletSalesItemWiseBreakupReportbyprodidService(fastify) {
  const { outletSalesItemWiseBreakupReportbyprodid } = outletSalesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await outletSalesItemWiseBreakupReportbyprodid.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

function warehouseSalesOverviewService(fastify) {
  const { outletSalesOverview, getWarehouseCashCloseDenominatonByDate } = outletSalesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;

    const response = await outletSalesOverview.call(knex, {
      body,
      params,
      logTrace
    });

    const dinominationDetails = await getWarehouseCashCloseDenominatonByDate.call(knex, {
      body,
      params,
      logTrace
    });

    return {
      total_sales: parseFloat(response.total_card || 0) +
        parseFloat(response.total_cash || 0) +
        parseFloat(response.total_upi || 0) +
        parseFloat(response.total_loyalty || 0) +
        parseFloat(response.total_less_amount || 0),
      total_invoices: response.total_invoices,
      total_card: parseFloat(response.total_card || 0),
      total_cash: parseFloat(response.total_cash || 0) - parseFloat(response.total_return_used || 0),
      total_upi: parseFloat(response.total_upi || 0),
      total_return: response.total_return,
      total_return_used: parseFloat(response.total_return_used || 0) + parseFloat(response.total_return_by_cash || 0),
      total_loyalty: response.total_loyalty,
      total_return_count: parseFloat(response.total_return_count || 0) + parseFloat(response.total_return_cash_count || 0),
      total_less_amount: response.total_less_amount,
      dinominationDetails: dinominationDetails
    };
  };
}


module.exports = {
  getOutletSalesReportService,
  getOutletSalesItemwiseReportService,
  getOutletSalesItemwiseBreakupReportService,
  outletSalesItemWiseAllReportService,
  getOutletSalesGroupwiseAllReportService,
  outletSalesOverviewService,
  outletSalesItemWiseBreakupReportbyprodidService,
  getOutletSalesBranchwiseReportService,
  getOutletSalesBranchwisePhysicalStockReportService,
  outletSalesOutletWiseCurrentDateReportService,
  warehouseSalesOverviewService
};
