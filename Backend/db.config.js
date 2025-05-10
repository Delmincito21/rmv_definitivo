module.exports = {
    HOST: process.env.DB_HOST || "bonsvukyvr16pz1h7azm-mysql.services.clever-cloud.com",
    USER: process.env.DB_USER || "unnjmt2frwqemf3m",
    PASSWORD: process.env.DB_PASSWORD || "bonsvukyvr16pz1h7azm",
    DB: process.env.DB_NAME || "bonsvukyvr16pz1h7azm",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};