module.exports = {
  CONDENSE_PROMPT: `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

  Chat History:
  {chat_history}

  Follow Up Input: {question}

  Standalone question:`,
  QA_PROMPT: `You are an AI chat assistant designed to answer questions about university admissions.
  Use the following pieces of context to answer the question at the end.
  If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
  If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

  {context}

  Question: {question}
  Your answer:`
}