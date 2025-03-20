import express from "express";
import knex from "../database_client.js";
import bodyParser from "body-parser";

const mealsRouter = express.Router();

mealsRouter.use(express.json());
mealsRouter.use(bodyParser.json());
mealsRouter.use(bodyParser.urlencoded({ extended: true }));

// Get all meals
mealsRouter.get("/", async (req, res) => {
    const meals = await knex.select("*").from("meal");
    res.json({ reservations: meals });
  });
  

//Adds a new meal to the database
mealsRouter.post("/", async (req, res) => {
    const { title, description, location, when, max_reservations, price, created_date } = req.body;
    if (!title || !description || !when || !max_reservations || !price || !created_date) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    try {
        // Insert the new meal
        const insertQuery = `
          INSERT INTO meal (title, description, location, when, max_reservations, price, created_date) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await knex.raw(insertQuery, [title, description, location, when, max_reservations, price, created_date]);

        // Get the ID of the last inserted record using LAST_INSERT_ID()
        const result = await knex.raw('SELECT LAST_INSERT_ID() AS meal_id');
        const mealId = result[0][0].meal_id;

        // Retrieve the inserted meal using the mealId
        const meal = await knex.raw('SELECT * FROM meal WHERE id = ?', [mealId]);  

        
        return res.status(201).json({ meal });
    } catch (error) {
        console.error("Error inserting meal:", error);
        return res.status(500).json({ message: "Error adding meal" });
    }
  }
);

//get meal by id
mealsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const meal = await knex.raw("SELECT * FROM meal WHERE id = ?", [id]);
    if (meal[0].length === 0) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.json({ meal: meal[0][0] });
  });

// update the meal by id
mealsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, location, when, max_reservations, price, created_date } = req.body;
    if (!title || !description || !when || !max_reservations || !price || !created_date) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    try {
        const updateQuery = `
          UPDATE meal 
          SET title = ?, description = ?, location = ?, when = ?, max_reservations = ?, price = ?, created_date = ?
          WHERE id = ?
        `;
        await knex.raw(updateQuery, [title, description, location, when, max_reservations, price, created_date, id]);
        const meal = await knex.raw("SELECT * FROM meal WHERE id = ?", [id]);
        res.json({ meal: meal[0][0] });
    } catch (error) {
        console.error("Error updating meal:", error);
        return res.status(500).json({ message: "Error updating meal" });
    }
  });

//delete meal by id
mealsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const meal = await knex.raw("SELECT * FROM meal WHERE id = ?", [id]);
    if (meal[0].length === 0) {
      return res.status(404).json({ message: "Meal not found" });
    }
    await knex.raw("DELETE FROM meal WHERE id = ?", [id]);
    res.json({ message: "Meal deleted" });
  });


export default mealsRouter;
