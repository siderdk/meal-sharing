'use client';
import { useState } from 'react';
import { useEffect } from 'react';

export default function MealsList() {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
       
        const fetchMeals = async () => {
            try {
                    const response = await fetch('http://localhost:8001/api/meals');
                    const data = await response.json();
                    setMeals(data.meals);
                    console.log("Fetched data:", data);
                } catch (error) {
                console.error("Error fetching meals:", error);
                }}
        fetchMeals();
      }, []);

  return (
    <>
        <h1>Meals List</h1>
        <ul>
            {meals.length > 0 ? (
                    meals.map((meal, index) => 
                    <li key={index}>
                        <ul>
                            <li key={meal.title}>{meal.title}</li>
                            <li key={meal.description}>Description: {meal.description}</li>
                            <li key={meal.price}>Price: {meal.price}kr.</li>
                            <li key={meal.location}>Find it at: {meal.location}</li>
                        </ul>
                        <br />
                    </li>)
                ) : (
                    <p>Loading meals...</p>
                )}
        </ul>

    </>
  );
}