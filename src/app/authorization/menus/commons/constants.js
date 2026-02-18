const MENU = {
  NAME: "menu",
  COLUMNS: {
    ID: "id",
    MENU_NAME: "menu_name",
    MENU_ICON: "menu_icon",
    MENU_URL: "menu_url",
    MENU_ORDER: "menu_order",
    COMPANY_ID: "company_id",
    IS_OUTLET: "is_outlet",
    IS_WAREHOUSE: "is_warehouse",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};
const SUBMENU = {
  NAME: "submenu",
  COLUMNS: {
    ID: "id",
    MENU_ID: "menu_id",
    SUBMENU_NAME: "sub_menu_name",
    SUBMENU_URL: "sub_menu_url",
    SUBMENU_ORDER: "sub_menu_order",
    COMPANY_ID: "company_id",
    IS_OUTLET: "is_outlet",
    IS_WAREHOUSE: "is_warehouse",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const MENU_AUTH = {
  NAME: "menu_authorization",
  COLUMNS: {
    ID: "id",
    USER_ID: "user_id",
    MENU_ID: "menu_id",
    ROLE_ID: "role_id",
    SUBMENU_ID: "submenu_id",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    IS_OUTLET: "is_outlet",
    IS_WAREHOUSE: "is_warehouse",
    VIEW: "view",
    SAVE: "save",
    EDIT: "edit",
    DELETE: "delete",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

module.exports = {
  MENU,
  SUBMENU,
  MENU_AUTH
};
