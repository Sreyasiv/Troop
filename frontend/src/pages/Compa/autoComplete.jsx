import { useEffect } from "react";
import axios from "axios";

const Autocomplete = ({ inputValue, setGhostText, enable }) => {
  useEffect(() => {
    if (!enable || !inputValue.trim()) {
      setGhostText("");
      return;
    }

    const fetchSuggestion = async () => {
      try {
        console.log("💬 Autocomplete request received:", inputValue);
        const response = await axios.post("http://localhost:8000/api/compaRoutes/autocomplete", {
          prompt: inputValue,
        });

        const suggestion = response.data?.suggestion?.trim();
        if (suggestion && typeof suggestion === "string") {
          console.log("🎯 Autocomplete suggestion received:", suggestion);
          setGhostText(suggestion);
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
  }, [inputValue, enable, setGhostText]);

  return null;
};

export default Autocomplete;