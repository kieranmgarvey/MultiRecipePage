const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const indexRoutes = require('./routes/index');
const recipeRoutes = require('./routes/recipes');
const addRecipeRoutes = require('./routes/addRecipe');
const db = require('./db/connection'); 

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

app.use('/', indexRoutes);
app.use('/recipes', recipeRoutes);
app.use('/add-recipe', addRecipeRoutes);

app.get('/add-recipe', async (req, res) => {
    try {
        const [ingredients] = await db.query('SELECT id, name FROM ingredients');
        const [proteinTypes] = await db.query('SELECT DISTINCT protein_type AS name FROM recipes');
        res.render('addRecipe', { ingredients, proteinTypes });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Database query error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});