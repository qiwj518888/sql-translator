import fetch from "isomorphic-unfetch";

const translateToSQL = async (query, apiKey, tableSchema = "") => {
  // Validate inputs
  if (!query || !apiKey) {
    throw new Error("Missing query or API key.");
  }

  // Construct the prompt
  const prompt = `Translate the following natural language query into SQL without altering the case of any entries:\n\n"${query}"\n\n${tableSchema ? `Use the following table schema:\n\n${tableSchema}\n\n` : ''}SQL Query:`;

  console.log(prompt);

  // API request payload
  const payload = {
    prompt,
    temperature: 0.5,
    max_tokens: 2048,
    n: 1,
    stop: "\\n",
    model: "gpt-3.5-turbo-instruct",
    frequency_penalty: 0.5,
    presence_penalty: 0.5,
    logprobs: 10,
  };

  // Make the API request
  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    // Check for API errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", response.status, errorData);
      throw new Error(errorData.error?.message || "Error translating to SQL.");
    }

    // Parse the response
    const { choices } = await response.json();
    return choices[0]?.text?.trim() || "No SQL query returned.";
  } catch (error) {
    console.error("Request Error:", error);
    throw new Error("Error processing the request.");
  }
};

export default translateToSQL;
