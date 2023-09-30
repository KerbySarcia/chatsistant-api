const openai = require("openai");

const ai = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

const RULES = `You are an AI chat assistant designed to answer questions about university admissions.
 Use the following pieces of context to answer the question at the end.
 If you don't know the answer, just say you don't know. 
 DO NOT try to make up an answer. 
 If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.`;

const textCompletion = async (text, question) => {
  if (!ai.apiKey) {
    return "Api key not configured!";
  }
  const context = text.map((item) => `${item.information}`).toString();
  const content = `Based on this context: \n\n ${RULES}.\n\n ${context} \n \n Query:${question} \n \n Answer: `;
  try {
    const completion = await ai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "assistant",
          content: content,
        },
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
};

module.exports = {
  textCompletion,
};
