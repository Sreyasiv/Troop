import directionsData from "./directions";

const getGemmaResponse = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  const fromToRegex = /from (.*?) to (.*?)([.?!]|$)/i;
  const match = lowerPrompt.match(fromToRegex);

  if (match) {
    const fromRaw = match[1].trim();
    const toRaw = match[2].trim();

    const fromKey = Object.keys(directionsData).find(
      key => key.toLowerCase() === fromRaw
    );
    const toKey = `to ${toRaw.charAt(0).toUpperCase()}${toRaw.slice(1)}`;

    if (fromKey && directionsData[fromKey][toKey]) {
      return directionsData[fromKey][toKey];
    } else {
      return `Hmm… I couldn’t find a direction from "${fromRaw}" to "${toRaw}". Check your spelling maybe? 🧐`;
    }
  }

  return null; // Let LLM or other fallback handle it
};

export default getGemmaResponse;
