const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = 'mongodb+srv://aplhmk:Password123@cluster0.mamiy.mongodb.net/myDatabase?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err.message));

// Define the recipe schema
const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  cuisine: { type: String, required: true },
  prepTime: { type: Number, required: true },
  cookTime: { type: Number, required: true },
});

// Create a model for the recipe schema
const Recipe = mongoose.model('Recipe', recipeSchema);

// Seed the database with sample recipes
const seedDatabase = async () => {
  const recipes = [
    {
      name: "Brownies",
      ingredients: [
        "1/2 cup unsalted butter",
        "1 cup sugar",
        "2 eggs",
        "1/3 cup cocoa powder",
        "1 cup flour",
        "1/4 tsp salt",
        "1/4 tsp baking powder"
      ],
      instructions: "Preheat oven to 350°F. Melt butter and combine with sugar. Mix in eggs and cocoa powder. Add flour, salt, and baking powder. Bake for 20-25 minutes.",
      cuisine: "American",
      prepTime: 15,
      cookTime: 25
    },
    {
      name: "Korean Beef",
      ingredients: [
        "1 lb ground beef",
        "1/4 cup soy sauce",
        "2 tbsp brown sugar",
        "1 tsp sesame oil",
        "1 tbsp garlic (minced)",
        "1 tbsp ginger (grated)",
        "1/2 tsp red pepper flakes",
        "1/4 cup green onions (chopped)"
      ],
      instructions: "Brown ground beef in a skillet. Add soy sauce, brown sugar, sesame oil, garlic, ginger, and red pepper flakes. Cook until the sauce thickens. Garnish with green onions.",
      cuisine: "Korean",
      prepTime: 10,
      cookTime: 15
    }
  ];

  try {
    const existingRecipes = await Recipe.find({});
    if (existingRecipes.length === 0) {
      await Recipe.insertMany(recipes);
      console.log('Recipes added successfully!');
    } else {
      console.log('Recipes already exist in the database.');
    }
  } catch (err) {
    console.error('Error adding recipes:', err.message);
  }
};

// Call the seed function once on server start
seedDatabase();

// API endpoint to fetch recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipes', error: err });
  }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));