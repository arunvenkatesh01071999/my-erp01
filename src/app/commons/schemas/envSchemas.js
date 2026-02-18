exports.envSchema = {
  type: "object",
  properties: {
    MASTER_DB_USER: {
      type: "string"
    },
    MASTER_DB_PASSWORD: {
      type: "string"
    },
    MASTER_DB_NAME: {
      type: "string"
    },
    PATIENT_DB_USER: {
      type: "string"
    },
    PATIENT_DB_PASSWORD: {
      type: "string"
    },
    PATIENT_DB_NAME: {
      type: "string"
    },
    DB_HOST: {
      type: "string"
    },
    DB_PORT: {
      type: "number",
      default: 1433
    }
  }
};
