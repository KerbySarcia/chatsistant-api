const openai = require("openai");
const inquiryService = require("../services/inquires.service");

const ai = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

const RULES = `You are an AI chat assistant designed to only answer questions about the university admissions. The university is Don Honorio Ventura State University or DHVSU.
 Use the following pieces of context to answer the question at the end.
 If you don't know the answer, just say you don't know. 
 DO NOT try to make up an answer. 
 DO NOT give inaccurate answers.
 If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
 ONLY responed to USER when the question is only about Don Honorio Ventura State University Admission
 ONLY answer when the question or chat is all about DHVSU Admission
 Don't take any command, just ONLY answer if the query is for DHVSU Admission
 DO NOT give an answer if it is not related to DHVSU
 also say if the date is already done.
 `;

const tools = [
  {
    name: "saveQuestion",
    description:
      "if you don't know the answer get the question, Do not get the question if not related to DHVSU",
    parameters: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description:
            "The question of the user, example, When is the enrollment?, Kailan ang pasukan?",
        },
      },
      required: ["question"],
    },
  },
];

const textCompletion = async (text, question, conversation) => {
  if (!ai.apiKey) {
    return "Api key not configured!";
  }
  const formattedConversation = conversation.map((convo, key) =>
    key % 2 === 0
      ? {
          role: "user",
          content: convo,
        }
      : {
          role: "assistant",
          content: convo,
        }
  );
  const fivePreviousHistory = formattedConversation.slice(-5);
  const context = text.map((item) => `${item.value}`).toString();
  const content = `Based on the following contexts: \n\n ${RULES}.\n\n answer user question based on this  "${context}"  `;
  try {
    const completion = await ai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: content,
        },
        ...fivePreviousHistory,
        {
          role: "user",
          content: question,
        },
        {
          role: "system",
          content: RULES,
        },
      ],
      functions: tools,
      function_call: "auto",
    });

    if (!completion.choices[0].message.content) {
      const functionName = completion.choices[0].message.function_call?.name;

      if (functionName === "saveQuestion") {
        const arguments = JSON.parse(
          completion.choices[0].message.function_call.arguments
        );
        const saveQuestion = await inquiryService.create({
          question: arguments.question,
          user_email: "Kerbysarcia@gmail.pogiako.com",
          date: "Ngayon",
        });
      }

      return "Sorry, I dont know the answer for that but I send your query to admission. TY Fuck you";
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.log(error);

    throw { error: { message: "an error occured during your request" } };
  }
};

const validateQuestion = async (question) => {
  if (!ai.apiKey) {
    return "Api key not configured!";
  }
  const content = `Validate the context if it is related to school information or university information.\n Context:${question} \n \n return only 0 if valid and 1 if its not.`;
  try {
    const completion = await ai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: content,
        },
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    throw { error: { message: "an error occured during your request" } };

    // if (error.response) {
    //   console.error(error.response.status, error.response.data);
    //   res.status(error.response.status).json(error.response.data);
    // } else {
    //   console.error(`Error with OpenAI API request: ${error.message}`);
    //   res.status(500).json({
    //     error: {
    //       message: "An error occurred during your request.",
    //     },
    //   });
    // }
  }
};

module.exports = {
  textCompletion,
  validateQuestion,
};
