const getAdminUserSchema = require("./getAdminUserSchema");
const postAdminUserSchema = require("./postAdminUserSchema");
const putAdminUserSchema = require("./putAdminUserSchema");
const deleteAdminUserSchema = require("./deleteAdminUserSchema");
const adminLoginSchema = require("./adminLoginSchema");
const adminUserInfoSchema = require("./adminUserInfoSchema");
const adminLogoutSchema = require("./adminLogoutSchema");
const getAdminUserListSchema = require("./getAdminUserListSchema");
const userInfoSchema = require("./userInfoSchema");

module.exports = {
  getAdminUserSchema,
  postAdminUserSchema,
  putAdminUserSchema,
  deleteAdminUserSchema,
  adminLoginSchema,
  adminUserInfoSchema,
  adminLogoutSchema,
  getAdminUserListSchema,
  userInfoSchema
};
