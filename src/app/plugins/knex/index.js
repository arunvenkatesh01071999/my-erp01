const fp = require("fastify-plugin");
const knex = require("knex");
const setupPaginator = require("./paginator");
const { connectionCheck } = require("../../commons/helpers");

const knexPlugin = async (fastify, { scmDbConfig }) => {
  try {
    const scmDb = knex({ ...scmDbConfig });

    setupPaginator(scmDb);

    await Promise.all([connectionCheck(scmDb)]);
    fastify.decorate("knexMedical", scmDb);
  } catch (e) {
    fastify.log.error(`DB connection failed`);
    throw Error(`Connection Failed ${e}`);
  }
};

module.exports = fp(knexPlugin);
