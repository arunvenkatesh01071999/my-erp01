const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const adminRepo = require("../repository/admin");
const getSalesManInfoService = require("../../../catalog/salesman/services/salesManServices");

function getAdminUserService(fastify) {
  const { getAdminUser } = adminRepo(fastify);

  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const created_by = userDetails.id;
    console.log(created_by);
    const response = await getAdminUser.call(knex, {
      params,
      body,
      query,
      logTrace
    });

    return response;
  };
}
function postAdminUserService(fastify) {
  const { postAdminUser } = adminRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postAdminUser.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putAdminUserService(fastify) {
  const { putAdminUser } = adminRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { user_id, company_id } = params;
    const promise1 = putAdminUser.call(knex, {
      user_id,
      company_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteAdminUserService(fastify) {
  const { deleteAdminUser } = adminRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { user_id, company_id } = params;
    const promise1 = deleteAdminUser.call(knex, {
      user_id,
      company_id,
      params,
      body,
      userDetails,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function adminLoginService(fastify) {
  const { adminLogin, loginCheck, loginFlag, loginIpLog } = adminRepo(fastify);
  return async ({ params, body, logTrace, request }) => {
    const knex = fastify.knexMedical;
    const promise1 = adminLogin.call(knex, {
      body,
      logTrace
    });


    // const response = await promise1;

    const response1 = await Promise.all([promise1]);
    const response = response1[0].user;
    const token = await fastify.jwt.sign({ response });

    const loginFlagResponse = await loginFlag.call(knex, {
      body,
      logTrace,
      token
    });

    const ip = request?.ip;
    const userAgent = request?.headers?.['user-agent'];
    let id;
    let user_type;
    let outlet;
    let warehouse;

    if (Number(response1[0]?.user?.user_type) === 0 || Number(response1[0]?.user?.user_type) === 1) {
      id = response1[0].user.id;
      user_type = response1[0].user.user_type;
      outlet = Number(response1[0].user.user_type) === 0 ? response1[0].outlets : [];
      warehouse = Number(response1[0].user.user_type) === 1 ? response1[0].warehouse : [];
    } else {
      id = response1[0].user.id; // same here unless you plan something different
      user_type = response1[0].user.user_type;
      outlet = response1[0].outlets;
      warehouse = response1[0].warehouse
    }
    console.log("user response", id)
    await loginIpLog.call(knex, {
      user_id: id,
      ip_address: ip,
      user_agent: userAgent,
      logTrace
    });
    return {
      success: true,
      token,
      user_type,
      outlet,
      warehouse
    };
  };
}




function getAdminUserInfoService(fastify) {
  const { getAdminUserInfo } = adminRepo(fastify);
  const getSalesManInfo = getSalesManInfoService.getSalesManInfoByBioCodeService(fastify);

  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getAdminUserInfo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });

    const promise2 = await getSalesManInfo({
      params: { biocode: 1 },
      logTrace
    });


    return {
      ...response,
      salesmandetails: promise2

    };
  };
}
function adminLogoutService(fastify) {
  const { adminLogout } = adminRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = adminLogout.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getAdminUserListService(fastify) {
  const { getAdminUserList } = adminRepo(fastify);

  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const created_by = userDetails.id;
    console.log(created_by);
    const response = await getAdminUserList.call(knex, {
      params,
      body,
      query,
      logTrace
    });

    return response;
  };
}


function userInfoService(fastify) {
  const { userInfo } = adminRepo(fastify);
  const getSalesManInfo = getSalesManInfoService.getSalesManInfoByBioCodeService(fastify);

  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await userInfo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });

    const promise2 = await getSalesManInfo({
      params: { biocode: 1 },
      logTrace
    });

    return {
      ...response,
      salesmandetails: promise2

    };
  };
}

module.exports = {
  getAdminUserService,
  postAdminUserService,
  putAdminUserService,
  deleteAdminUserService,
  adminLoginService,
  getAdminUserInfoService,
  adminLogoutService,
  getAdminUserListService,
  userInfoService
};
