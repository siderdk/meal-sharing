import express from "express";
import knex from "../database_client.js";
import bodyParser from "body-parser";


const reservationsRouter = express.Router();
reservationsRouter.use(express.json());
reservationsRouter.use(bodyParser.json());
reservationsRouter.use(bodyParser.urlencoded({ extended: true }));

// Get all reservations
reservationsRouter.get("/", async (req, res) => {
  const reservations = await knex.select("*").from("reservation");
  res.json({ reservations });
});

//Adds a new reservation to the database
reservationsRouter.post("/", async (req, res) => {
    const { number_of_guests, meal_id, contact_phone_number, contact_name, contact_email } = req.body;

    if (!number_of_guests || !meal_id || !contact_phone_number || !contact_name || !contact_email) {
        return res.status(400).json({ message: "Please provide all fields" });
    }
    try {
        const created_date = new Date().toISOString().slice(0, 10);
        // Insert the new reservation
        const [reservation] = await knex('reservation')
            .insert({
                number_of_guests,
                meal_id,
                contact_phone_number,
                contact_name,
                contact_email,
                created_date
            })
            .returning('*');
                 
        return res.status(201).json({ reservation });

    } catch (error) {
        console.error("Error inserting reservation:", error);
        return res.status(500).json({ message: "Error adding reservation" });
    }

});
    

//get reservation by id
reservationsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const reservation = await knex('reservation').where({ id });
    if (reservation.length === 0) {
        return res.status(404).json({ message: "Reservation not found" });
    }
    res.json({ reservation: reservation[0] });
});

// update the reservation by id
reservationsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { number_of_guests, meal_id, contact_phone_number, contact_name, contact_email } = req.body;

    if (!number_of_guests || !meal_id || !contact_phone_number || !contact_name || !contact_email) {
        return res.status(400).json({ message: "Please provide all fields" });
    }

    try {
        const updated_date = new Date().toISOString().slice(0, 10);
        // Update the reservation
        const [reservation] = await knex('reservation')
            .where({ id })
            .update({
                number_of_guests,
                meal_id,
                contact_phone_number,
                contact_name,
                contact_email,
                updated_date
            })
            .returning('*');

        res.json({ reservation });

    } catch (error) {
        console.error("Error updating reservation:", error);
        return res.status(500).json({ message: "Error updating reservation" });
    }
});

//delete reservation by id
reservationsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const reservation = await knex('reservation').where({ id });
    if (reservation.length === 0) {
        return res.status(404).json({ message: "Reservation not found" });
    }
    await knex('reservation').where({ id }).del();
    res.json({ message: "Reservation deleted" });
});




export default reservationsRouter;
