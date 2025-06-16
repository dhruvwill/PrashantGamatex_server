import { TYPES } from "tedious";
export default {
  gamatex: {
    client: "mssql",
    connection: {
      server: "pgplcrm.c1cwyqmombu9.ap-south-1.rds.amazonaws.com",
      user: "admin",
      password: "PGPLCRM1234",
      database: "PGPLCRM",
      options: {
        trustedConnection: true,
        trustServerCertificate: true,
        mapBinding: (value: any) => {
          // bind all strings to varchar instead of nvarchar
          if (typeof value === "string") {
            return {
              type: TYPES.VarChar,
              value,
            };
          }

          // allow devs to pass tedious type at query time
          if (value != null && value.type) {
            return {
              type: value.type,
              value: value.value,
            };
          }

          // undefined is returned; falling back to default mapping function
        },
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  ferber: {
    client: "mssql",
    connection: {
      server: "pgplcrm.c1cwyqmombu9.ap-south-1.rds.amazonaws.com",
      user: "admin",
      password: "PGPLCRM1234",
      database: "FerberTest",
      options: {
        trustedConnection: true,
        trustServerCertificate: true,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  westpoint: {
    client: "mssql",
    connection: {
      server: "pgplcrm.c1cwyqmombu9.ap-south-1.rds.amazonaws.com",
      user: "admin",
      password: "PGPLCRM1234",
      database: "WestPointTest",
      options: {
        trustedConnection: true,
        trustServerCertificate: true,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
