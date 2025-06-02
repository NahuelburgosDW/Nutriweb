const { GoogleGenerativeAI } = require('@google/generative-ai');
const { RECIPE_GENERATION_PROMPT } = require('../constants/prompts'); 

class RecipeService {
    constructor(apiKey) {
        if (!apiKey) {
            throw new AppError('API Key para Gemini no proporcionada en el servicio.', 500);
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }

    // Método para extraer JSON de bloques de código Markdown
    _extractJsonFromMarkdown(text) {
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            return jsonMatch[1];
        }
        const generalCodeBlockMatch = text.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
        if (generalCodeBlockMatch && generalCodeBlockMatch[1]) {
            return generalCodeBlockMatch[1];
        }
        return text;
    }

    /**
     * Obtiene un listado de recetas de la IA basadas en los ingredientes proporcionados.
     * @param {string} ingredients - Lista de ingredientes separados por comas.
     * @param {number} numRecipes - Número de recetas a generar (por defecto 3).
     * @returns {Promise<Array<object>>} - Un array de objetos receta.
     */
    async getRecipes(ingredients, numRecipes = 3) { // Cambiado a getRecipes (plural)
        let rawText;
        try {
            const result = await this.model.generateContent(RECIPE_GENERATION_PROMPT);
            const response = await result.response;
            rawText = response.text();
        } catch (apiError) {
            console.error('Error de API de Gemini:', apiError);
            throw new AppError('Error al comunicarse con el servicio de IA. Intenta de nuevo más tarde.', 502);
        }

        const jsonString = this._extractJsonFromMarkdown(rawText);

        try {
            const parsedResponse = JSON.parse(jsonString);
            if (parsedResponse && Array.isArray(parsedResponse.recetas)) {
                return parsedResponse.recetas;
            } else {
                throw new Error('La respuesta de la IA no contiene el array "recetas" esperado.');
            }
        } catch (parseError) {
            console.error('Error al parsear el JSON de la IA en el servicio:', parseError);
            console.error('Raw text recibido de la IA:', rawText);
        }
    }
}

module.exports = new RecipeService(process.env.GEMINI_API_KEY);