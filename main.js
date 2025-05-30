require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = process.env.HF_MODEL;
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

console.log('HF_API_KEY:', process.env.HF_API_KEY);


app.post('/preguntar', async (req, res) => {
  const { mensaje } = req.body;
  if (!mensaje) return res.status(400).json({ error: 'Falta el campo mensaje' });

  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: mensaje },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // La respuesta puede venir distinta según el modelo, pero suele ser response.data[0].generated_text o response.data.generated_text
    let respuesta = 'Sin respuesta';
    if (Array.isArray(response.data) && response.data[0].generated_text) {
      respuesta = response.data[0].generated_text;
    } else if (response.data.generated_text) {
      respuesta = response.data.generated_text;
    } else if (typeof response.data === 'string') {
      respuesta = response.data;
    }

    res.json({ respuesta });
  } catch (error) {
    console.error('Error en Hugging Face detalle:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al llamar a Hugging Face' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
