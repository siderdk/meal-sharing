import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

//Future meals
apiRouter.get("/future-meals", async (req, res) => {
  const meals = await knex("meal").select("*").where("when", ">", new Date());
  res.json({ meals });
});

//Past meals
apiRouter.get("/past-meals", async (req, res) => {
  const meals = await knex("meal").select("*").where("when", "<", new Date());
  res.json({ meals });
});

//All meals sorted by ID
apiRouter.get("/all-meals", async (req, res) => {
  const meals = await knex("meal").select("*").orderBy("id");
  res.json({ meals });
});


//first meal
apiRouter.get("/first-meal", async (req, res) => {
  const meal = await knex("meal").select("*").orderBy("id").first();
  if (!meal) {
    return res.status(404).json({ message: "No meals found" });
  }
  res.json({ meal });
});

//last meal
apiRouter.get("/last-meal", async (req, res) => {
  const meal = await knex("meal").select("*").orderBy("id", "desc").first();
  if (!meal) {
    return res.status(404).json({ message: "No meals found" });
  }
  res.json({ meal });
});


// You can delete this route once you add your own routes
apiRouter.get("/", async (req, res) => {
  const SHOW_TABLES_QUERY =
    process.env.DB_CLIENT === "pg"
      ? "SELECT * FROM pg_catalog.pg_tables;"
      : "SHOW TABLES;";
  const tables = await knex.raw(SHOW_TABLES_QUERY);
  res.json({ tables });
});

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
