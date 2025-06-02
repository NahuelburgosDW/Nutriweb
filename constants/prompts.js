const RECIPE_GENERATION_PROMPT = ({ ingredients, numRecipes }) => `Genera ${numRecipes} ideas de recetas de comida utilizando los siguientes ingredientes: ${ingredients}.
La respuesta debe ser un objeto JSON que contenga una clave "recetas" cuyo valor sea un array de objetos.
Cada objeto dentro del array "recetas" debe representar una receta y contener las siguientes claves:
- "nombre_comida": Un string con el nombre descriptivo de la comida.
- "ingredientes": Un array de strings, donde cada string es un ingrediente con su cantidad.
- "pasos": Un array de strings, donde cada string es un paso detallado de la preparación.

Asegúrate de que la salida sea un JSON válido y solo el JSON, sin texto adicional antes o después.

Ejemplo de formato de salida (para una sola receta en este ejemplo):
{
  "recetas": [
    {
      "nombre_comida": "Pollo con Arroz al Limón",
      "ingredientes": [
        "500g de pechuga de pollo",
        "1 taza de arroz blanco",
        "1 cebolla pequeña picada"
      ],
      "pasos": [
        "Corta el pollo en cubos y sazona.",
        "Cocina el arroz según instrucciones."
      ]
    }
  ]
}
`;

module.exports = {
    RECIPE_GENERATION_PROMPT,
};