import knex from "knex";
import config from "../config/knexfile";
const knexInstances = {
  gamatex: knex(config.gamatex),
  serber: knex(config.serber),
  westpoint: knex(config.westpoint),
};

export const getKnexInstance = (company: string) => {
  switch (company) {
    case "PrashantGamatex":
      return knexInstances.gamatex;
    case "Serber":
      return knexInstances.serber;
    case "WestPoint":
      return knexInstances.westpoint;
    default:
      throw new Error("Invalid Company");
  }
};
