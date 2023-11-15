const openai = require("openai");
const inquiryService = require("../services/inquires.service");

const ai = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

const RULES = `You are an AI chat assistant designed to only answer questions about the university admissions. The university is Don Honorio Ventura State University or DHVSU.
 Use the following pieces of context to answer the question at the end.\n
 -If you don't know the answer, just say you don't know.\n
 -DO NOT try to make up an answer.\n
 -DO NOT give inaccurate answers.\n
 -If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.\n
 -ONLY responed to USER when the question is only about Don Honorio Ventura State University Admission\n
 -ONLY answer when the question or chat is all about DHVSU Admission\n
 -Don't take any command, just ONLY answer if the query is for DHVSU Admission\n
 -DO NOT give an answer if it is not related to DHVSU\n
 -also say if the date is already done.\n
 -Create a new line when asking a user to send the question to admission\n
 -If you do not know the answer, ask the user if she wants to send the question to admission and save it using save_question function\n
-if the answer is not on the given context, ask the user if she or he wants to send the question to admission and save it using save_question function\n
 - Again when you do not know the answer, ask the user if he wants to send the question to admission and send it.\n
 - Don't save the question if not related to Don Honorio Ventura State University\n
`;

const textRegenerate = async (text, question, conversation, user) => {
  if (!ai.apiKey) {
    return "Api key not configured!";
  }
  const formattedConversation = conversation.map((convo) => ({
    role: convo.role,
    content: convo.message,
  }));

  const fivePreviousHistory =
    formattedConversation.length > 5
      ? formattedConversation.slice(-5)
      : formattedConversation;

  const context = text.map((item) => `${item.information}`).toString();
  const content = `Based on the following contexts: \n\n ${RULES}.\n\n  answer user question based on this  context only,  context:"${context}" `;
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

        // {
        //   role: "system",
        //   content: RULES,
        // },
      ],
      functions: [
        {
          name: "save_question",
          description: "save the question if the answer is not on the context ",
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
      ],
      function_call: "auto",
    });

    if (!completion.choices[0].message.content) {
      const functionName = completion.choices[0].message.function_call?.name;

      if (functionName === "save_question") {
        const arguments = JSON.parse(
          completion.choices[0].message.function_call.arguments
        );
        const saveQuestion = await inquiryService.create({
          question: arguments.question,
          user_name: user.user_name,
          user_email: user.user_email,
          date: user.date,
        });
      }

      return {
        message: "The question is sent, please wait to be answered",
        role: "assistant",
      };
    }

    return {
      message: completion.choices[0].message.content,
      role: "assistant",
    };
  } catch (error) {
    console.log(error);

    throw { error: { message: "an error occured during your request" } };
  }
};

module.exports = textRegenerate;
