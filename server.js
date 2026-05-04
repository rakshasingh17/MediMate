require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/predict", async (req, res) => {
  const { disease, inputs } = req.body;
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a medical AI assistant for educational purposes only. 
          Analyze the given health parameters and provide a risk assessment. 
          Always remind users this is for educational purposes and to consult a real doctor.
          Be clear, friendly and structured in your response.`
        },
        {
          role: "user",
          content: `Disease: ${disease}\nPatient Data: ${JSON.stringify(inputs)}\n
          Please provide:
          1. Risk Level (Low/Medium/High)
          2. Key observations from the data
          3. General health tips
          4. A reminder to consult a doctor`
        }
      ]
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.log("ERROR HAPPENED:");
    console.log(error);
    res.status(500).json({ error: error.message || "Something went wrong!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});