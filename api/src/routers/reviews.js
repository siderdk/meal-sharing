import express from "express";
import knex from "../database_client.js";
import bodyParser from "body-parser";
import e from "express";

const reviewsRouter = express.Router();

reviewsRouter.use(express.json());
reviewsRouter.use(bodyParser.json());
reviewsRouter.use(bodyParser.urlencoded({ extended: true }));

// Get all reviews
reviewsRouter.get("/", async (req, res) => {
    const reviews = await knex.select("*").from("review");
    res.json({ reviews });
}); 

//Get all reviews for a specific meal.
reviewsRouter.get("/meals/:meal_id/reviews", async (req, res) => {
    const { meal_id } = req.params;
    const reviews = await knex("review").where({ meal_id });
    res.json({ reviews });
}
);

//Adds a new review to the database
reviewsRouter.post("/", async (req, res) => {
    const { title, description, stars, meal_id } = req.body;

    if (!title || !description || !stars || !meal_id) {
        return res.status(400).json({ message: "Please provide all fields" });
    }
    try {
        const created_date = new Date().toISOString().slice(0, 10);
        // Insert the new review
        const [review] = await knex('review')
            .insert({
                title,
                description,
                stars,
                meal_id,
                created_date
            })
            .returning('*');
        return res.status(201).json({ review });

    } catch (error) {
        console.error("Error inserting review:", error);
        return res.status(500).json({ message: "Error adding review" });
    }

}
);  

//get review by id
reviewsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const review = await knex('review').where({ id });
    if (review.length === 0) {
        return res.status(404).json({ message: "Review not found" });
    }
    res.json({ review: review[0] });
});

// update the review by id
reviewsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, stars, meal_id } = req.body;

    if (!title || !description || !stars || !meal_id) {
        return res.status(400).json({ message: "Please provide all fields" });
    }
    try {
        // Update the review
        const [review] = await knex('review')
            .where({ id })
            .update({
                title,
                description,
                stars,
                meal_id
            })
            .returning('*');

        return res.json({ review });

    } catch (error) {
        console.error("Error updating review:", error);
        return res.status(500).json({ message: "Error updating review" });
    }

});

//delete review by id   
reviewsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const review = await knex('review').where({ id }).first(); 

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        await knex('review').where({ id }).del();
        res.json({ message: "Review deleted successfully" });

    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Error deleting review" });
    }
});

export default reviewsRouter;