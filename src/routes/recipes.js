const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Route to get all recipes categorized by protein type
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT id, title, protein_type FROM recipes ORDER BY protein_type');
        const categorizedRecipes = {
            Chicken: [],
            Beef: [],
            Tofu: [],
            Grains: []
        };

        results.forEach(recipe => {
            categorizedRecipes[recipe.protein_type].push(recipe);
        });

        res.render('recipeListing', { categorizedRecipes });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Database query error');
    }
});

// Route to get a specific recipe by ID
router.get('/:id', async (req, res) => {
    const recipeId = req.params.id;
    const query = `
        SELECT r.title, r.instructions, i.name AS ingredient_name
        FROM recipes r
        JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE r.id = ?;
    `;
    try {
        const [results] = await db.query(query, [recipeId]);
        if (results.length === 0) {
            return res.status(404).send('Recipe not found');
        }

        const recipe = {
            name: results[0].title,
            instructions: results[0].instructions,
            ingredients: results.map(row => ({
                name: row.ingredient_name
            }))
        };

        res.render('recipe', { recipe });
    } catch (err) {
        console.error('Error fetching recipe:', err);
        res.status(500).send('Error fetching recipe');
    }
});

// Route to delete a recipe by ID
router.delete('/:id', async (req, res) => {
    const recipeId = req.params.id;

    try {
        await db.query('DELETE FROM recipes WHERE id = ?', [recipeId]);
        res.redirect('/recipes'); // Ensure proper redirection
    } catch (err) {
        console.error('Error deleting recipe:', err);
        res.status(500).send('Error deleting recipe');
    }
});

module.exports = router;