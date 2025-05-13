const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
    try {
        const [ingredients] = await db.query('SELECT id, name FROM ingredients');
        const [proteinTypes] = await db.query('SELECT DISTINCT protein_type AS name FROM recipes'); // Fetch protein types
        res.render('addRecipe', { ingredients, proteinTypes });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Database query error');
    }
});

router.post('/', async (req, res) => {
    const { recipeName, proteinType, ingredients, instructions } = req.body;

    console.log('Received form data:', { recipeName, proteinType, ingredients, instructions });

    if (!recipeName || !proteinType || !instructions) {
        console.error('Validation error: Missing required fields');
        return res.status(400).send('Recipe name, protein type, and instructions are required.');
    }

    try {
        const [result] = await db.query(
            'INSERT INTO recipes (title, protein_type, instructions) VALUES (?, ?, ?)',
            [recipeName, proteinType, instructions]
        );

        const recipeId = result.insertId;

        if (ingredients) {
            let ingredientArray = Array.isArray(ingredients) ? ingredients : [ingredients];
            // Filter out invalid or undefined ingredient IDs
            ingredientArray = ingredientArray.filter(id => id && id !== 'undefined' && !isNaN(Number(id)));
            const ingredientQueries = ingredientArray.map(ingredientId => {
                return db.query(
                    'INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES (?, ?)',
                    [recipeId, ingredientId]
                );
            });

            await Promise.all(ingredientQueries);
        }

        console.log('Recipe added successfully with ID:', recipeId);
        res.redirect('/recipes');
    } catch (err) {
        console.error('Error adding recipe:', err);
        res.status(500).send('Error adding recipe');
    }
});

router.post('/add-ingredient', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Ingredient name is required.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO ingredients (name) VALUES (?)',
            [name]
        );

        res.json({ id: result.insertId, name });
    } catch (err) {
        console.error('Error adding ingredient:', err);
        res.status(500).json({ error: 'Error adding ingredient' });
    }
});

router.post('/add-protein', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Protein name is required.' });
    }

    try {
        const [rows] = await db.query(`
            SHOW COLUMNS FROM recipes LIKE 'protein_type'
        `);
        const enumStr = rows[0].Type;
        const matches = enumStr.match(/enum\((.*)\)/);
        let enumValues = [];
        if (matches && matches[1]) {
            enumValues = matches[1].split(',').map(v => v.trim().replace(/^'(.*)'$/, '$1'));
        }

        if (!enumValues.includes(name)) {
            let newEnumValues = enumValues.filter(v => v !== 'Other');
            newEnumValues.push(name);
            if (enumValues.includes('Other')) newEnumValues.push('Other');
            const enumSql = newEnumValues.map(v => `'${v.replace(/'/g, "\\'")}'`).join(', ');
            const alterSql = `ALTER TABLE recipes MODIFY protein_type ENUM(${enumSql}) NOT NULL DEFAULT 'Other';`;
            await db.query(alterSql);
        }

        res.json({ name });
    } catch (err) {
        console.error('Error adding protein:', err);
        res.status(500).json({ error: 'Error adding protein' });
    }
});
router.post('/delete-ingredient', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Ingredient ID is required.' });
    }

    try {
        await db.query('DELETE FROM ingredients WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting ingredient:', err);
        res.status(500).json({ error: 'Error deleting ingredient' });
    }
});
router.post('/delete-protein', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Protein name is required.' });
    }

    try {
        const [rows] = await db.query(`
            SHOW COLUMNS FROM recipes LIKE 'protein_type'
        `);
        const enumStr = rows[0].Type;
        const matches = enumStr.match(/enum\((.*)\)/);
        let enumValues = [];
        if (matches && matches[1]) {
            enumValues = matches[1].split(',').map(v => v.trim().replace(/^'(.*)'$/, '$1'));
        }

        if (enumValues.includes(name)) {
            let newEnumValues = enumValues.filter(v => v !== name);
            if (newEnumValues.length === 0) newEnumValues.push('Other');
            const enumSql = newEnumValues.map(v => `'${v.replace(/'/g, "\\'")}'`).join(', ');
            const alterSql = `ALTER TABLE recipes MODIFY protein_type ENUM(${enumSql}) NOT NULL DEFAULT 'Other';`;
            await db.query(alterSql);
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting protein:', err);
        res.status(500).json({ error: 'Error deleting protein' });
    }
});
router.post('/update-ingredient', async (req, res) => {
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ error: 'Ingredient ID and name are required.' });
    }

    try {
        await db.query('UPDATE ingredients SET name = ? WHERE id = ?', [name, id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating ingredient:', err);
        res.status(500).json({ error: 'Error updating ingredient' });
    }
});
router.delete('/ingredients/:id', async (req, res) => {
    const ingredientId = req.params.id;

    try {
        await db.query('DELETE FROM ingredients WHERE id = ?', [ingredientId]);
        res.redirect('/add-recipe');
    } catch (err) {
        console.error('Error deleting ingredient:', err);
        res.status(500).send('Error deleting ingredient');
    }
});

module.exports = router;