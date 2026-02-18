const STATES = {
  NAME: "states",
  COLUMNS: {
    ID: "id",
    NAME: "name",
    COUNTRYID: "country_id"
  }
};

const COUNTRIES = {
  NAME: "countries",
  COLUMNS: {
    ID: "id",
    SHORTNAME: "shortname",
    NAME: "name",
    PHONECODE: "phonecode"
  }
};
const CITIES = {
  NAME: "cities",
  COLUMNS: {
    ID: "id",
    NAME: "name",
    STATE_ID: "state_id",
    REGION_ID: "region_id"
  }
};

module.exports = {
  STATES,
  COUNTRIES,
  CITIES
};
