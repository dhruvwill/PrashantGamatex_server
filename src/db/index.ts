import knex from "knex";
import config from "../config/knexfile";
const knexInstances = {
  gamatex: knex(config.gamatex),
  ferber: knex(config.ferber),
  westpoint: knex(config.westpoint),
};

export const getKnexInstance = (company: string) => {
  switch (company) {
    case "PrashantGamatex":
      return knexInstances.gamatex;
    case "Ferber":
      return knexInstances.ferber;
    case "WestPoint":
      return knexInstances.westpoint;
    default:
      throw new Error("Invalid Company");
  }
};
