require('dotenv').config();
const axios = require('axios');

const HF_API_KEY = process.env.HF_API_KEY;

const modelos = [
  'tiiuae/falcon-7b-instruct',
  'gpt2',
  'microsoft/DialoGPT-medium',
  'facebook/blenderbot-400M-distill',
  'bert-base-uncased',
];

async function testModel(model) {
  console.log(`Probando modelo: ${model}`);  // LOG agregado
  const url = `https://api-inference.huggingface.co/models/${model}`;
  try {
    const response = await axios.post(
      url,
      { inputs: "Hola, ¿cómo estás?" },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,  // 15 segundos timeout
      }
    );
    console.log(`✅ Modelo: ${model} -> Respuesta:`, response.data);
  } catch (error) {
    if (error.response) {
      console.error(`❌ Modelo: ${model} -> Error ${error.response.status}:`, error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error(`❌ Modelo: ${model} -> Timeout`);
    } else {
      console.error(`❌ Modelo: ${model} -> Error inesperado:`, error.message);
    }
  }
}

async function testAll() {
  for (const model of modelos) {
    await testModel(model);
    console.log('-------------------------------');
  }
  console.log('Test finalizado');
}

testAll();
