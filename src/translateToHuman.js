import fetch from "isomorphic-unfetch";

const translateToHuman = async (query, apiKey) => {
  // Validate inputs
  if (!query || !apiKey) {
    throw new Error("Both query and API key are required.");
  }

  // Construct the API request payload
  const payload = {
    prompt: `Translate the following SQL query into natural language:\n\n"${query}"\n\nNatural language query:`,
    temperature: 0.5,
    max_tokens: 2048,
    n: 1,
    stop: "\\n",
    model: "text-davinci-003",
    frequency_penalty: 0.5,
    presence_penalty: 0.5,
    logprobs: 10,
  };

  try {
    // Make the API request
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
      throw new Error(errorData.error?.message || "Error translating query to natural language.");
    }

    // Parse and return the response
    const { choices } = await response.json();
    return choices[0]?.text?.trim() || "No translation available.";
  } catch (error) {
    console.error("Request Error:", error);
    throw new Error("Error processing the request.");
  }
};

export default translateToHuman;
