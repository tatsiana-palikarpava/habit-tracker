export default () => ({
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES,
  }
});