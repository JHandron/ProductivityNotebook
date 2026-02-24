const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  port: toInt(process.env.PORT, 3000),
  mongoUri: process.env.MONGO_URI ?? "",
  mongoDbName: process.env.MONGO_DB_NAME ?? "productivity_notebook"
};
