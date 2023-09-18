const { ChatOpenAI } = require("langchain/chat_models/openai");
const { ConversationalRetrievalQAChain } = require("langchain/chains");
const { HumanMessage, AIMessage } = require("langchain/schema");
const { PromptTemplate } = require("langchain/prompts");
const vectorstore = require("./vectorestore.service");
const prompts = require("../utils/prompts");

const query = async (question, history=[]) => {
  const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });

  if (!vectorstore.exists()) {
    await vectorstore.generate();
  }

  const vs = await vectorstore.load();
  const chain = ConversationalRetrievalQAChain.fromLLM(model, vs.asRetriever({ searchKwargs: { k: 1 } }), {
    qaChainOptions: {
      type: "stuff",
      prompt: PromptTemplate.fromTemplate(prompts.QA_PROMPT)
    },
    questionGeneratorChainOptions: {
      template: prompts.CONDENSE_PROMPT,
      llm: model,
    },
  });

  let chat_history = history
  if (history) {
    chat_history = history.map((message, i) => {
      return i % 2 == 0 ? new HumanMessage(message) : new AIMessage(message)
    });
  }

  const response = await chain.call({
    question,
    chat_history
  });

  console.log({ question, response: response.text });

  return response.text;
}

module.exports = {
  query,
};