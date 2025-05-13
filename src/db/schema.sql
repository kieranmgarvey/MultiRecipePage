CREATE DATABASE IF NOT EXISTS recipe_site;
USE recipe_site;

CREATE TABLE ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    origin VARCHAR(255),
    safety_tips TEXT,
    interesting_fact TEXT
);

CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    protein_type ENUM('Chicken', 'Beef', 'Tofu', 'Grains', 'Other') NOT NULL DEFAULT 'Other',
    instructions TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipe_ingredients (
    recipe_id INT,
    ingredient_id INT,
    quantity VARCHAR(50),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, ingredient_id)
);

INSERT INTO ingredients (name, origin, safety_tips, interesting_fact) VALUES
('Chicken', 'Various', 'Cook to an internal temperature of 165°F.', 'Chicken is one of the most consumed meats worldwide.'),
('Beef', 'Various', 'Avoid cross-contamination with raw beef.', 'Beef is rich in iron and protein.'),
('Tofu', 'China', 'Store in water and refrigerate after opening.', 'Tofu is made from soybeans and is a great protein source for vegetarians.'),
('Quinoa', 'South America', 'Rinse before cooking to remove saponins.', 'Quinoa is a complete protein and gluten-free grain.');

INSERT INTO recipes (title, description, protein_type, instructions) VALUES
('Grilled Chicken Salad', 'A healthy salad with grilled chicken and fresh vegetables.', 'Chicken', 'Grill the chicken, chop the vegetables, and mix together.'),
('Beef Stir Fry', 'Quick and easy beef stir fry with vegetables.', 'Beef', 'Stir fry beef and vegetables in a hot pan with soy sauce.'),
('Tofu Scramble', 'A vegan alternative to scrambled eggs.', 'Tofu', 'Crumble tofu and cook with spices and vegetables.'),
('Quinoa Bowl', 'A nutritious bowl with quinoa and assorted toppings.', 'Grains', 'Cook quinoa and top with your choice of vegetables and proteins.');