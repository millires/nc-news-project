
const ENV = process.env.NODE_ENV || "development";
// ...
const config = {};

if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2;
}
module.exports = new Pool(config);