const recipeService = require('../services/recipe.service');

class RecipeController {
    generateRecipes = async (req, res, next) => { 
        const { ingredients } = req.body;
        const numRecipes = parseInt(req.query.numRecipes) || 3;
        
        if (numRecipes < 1 || numRecipes > 5) { 
             return next('El número de recetas debe ser entre 1 y 5.', 400);
        }

        if (!ingredients || ingredients.trim() === '') {
            return next('Por favor, ingresa algunos ingredientes.', 400);
        }

        const recipes = await recipeService.getRecipes(ingredients, numRecipes);

        res.status(200).json({
            status: 'success',
            results: recipes.length,
            data: {
                recipes 
            }
        });
    };
}

module.exports = new RecipeController();