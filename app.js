require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const recipeRoutes = require('./routes/recipe.routes');
const config = require("./config");

// Middlewares globales
app.use(express.json()); 
app.use(cors()); 

//Rutas
app.use('/api/v1/recipes', recipeRoutes); 

const PORT = config.port || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});