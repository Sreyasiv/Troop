import { useEffect } from "react";
import axios from "axios";

const Autocomplete = ({ inputValue, setGhostText }) => {
  useEffect(() => {
    const fetchSuggestion = async () => {
  if (!inputValue.trim()) {
    setGhostText("");
    return;
  }

  try {
    console.log("💬 Autocomplete request received:", inputValue);
    const response = await axios.post('http://localhost:8000/api/compaRoutes/autocomplete', {
      prompt: inputValue,
    });

    const suggestion = response.data?.suggestion?.trim();

    if (suggestion && typeof suggestion === "string") {
  console.log("🎯 Autocomplete suggestion received:", suggestion);

  const inputLower = inputValue.toLowerCase();
  const suggestionLower = suggestion.toLowerCase();

  if (suggestionLower.startsWith(inputLower)) {
    const ghostOnly = suggestion.slice(inputValue.length);
    console.log("👻 Setting ghost text (sliced):", ghostOnly);
    setGhostText(ghostOnly);
  } else if (suggestionLower.includes(inputLower)) {
    // 🧠 Partial match fallback: show entire suggestion tail
    console.warn("⚠️ Suggestion contains input but not at start:", suggestion);
    const index = suggestionLower.indexOf(inputLower);
    const ghostOnly = suggestion.slice(index + inputValue.length);
    console.log("👻 Fallback ghost text:", ghostOnly);
    setGhostText(ghostOnly);
  } else {
    if (inputValue.length <= 4 && suggestion.length > 0) {
    console.warn("⚠️ Suggestion doesn't match but input is short, showing full suggestion");
    setGhostText(suggestion);
  } else {
    console.warn("⚠️ Suggestion does not include input:", suggestion);
    setGhostText("");
  }
  }
} else {
  console.warn("⚠️ Unexpected suggestion format:", response.data);
  setGhostText("");
}
  } catch (err) {
    console.error("Autocomplete error:", err);
    setGhostText("");
  }
};


    const debounce = setTimeout(fetchSuggestion, 500);
    return () => clearTimeout(debounce);
  }, [inputValue, setGhostText]);

  return null;
};

export default Autocomplete;
