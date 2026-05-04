const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: "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"
});

app.post("/predict", async (req, res) => {
  const { disease, inputs } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});