const axios = require("axios");

async function getEmbedding(query) {
  // Define the OpenAI API url and key.
  const url = process.env.OPENAI_EMBEDDING_URL;
  const openai_key = process.env.OPENAI_API_KEY; // Replace with your OpenAI key.

  // Call OpenAI API to get the embeddings.
  let response = await axios.post(
    url,
    {
      input: query,
      model: "text-embedding-ada-002",
    },
    {
      headers: {
        Authorization: `Bearer ${openai_key}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status === 200) {
    return response.data.data[0].embedding;
  } else {
    throw new Error(`Failed to get embedding. Status code: ${response.status}`);
  }
}

module.exports = getEmbedding;
