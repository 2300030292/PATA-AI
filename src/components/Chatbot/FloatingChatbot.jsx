// src/components/Chatbot/FloatingChatbot.jsx
import React, { useState } from "react";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi! I'm Pata AI Assistant. Ask me about address parsing, landmarks, pincodes, confidence score, or verification.",
    },
  ]);

  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
    };

    const botMessage = {
      role: "bot",
      text: generateBotResponse(input),
    };

    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  const generateBotResponse = (msg) => {
    const lower = msg.toLowerCase();

    if (
      lower.includes("address") ||
      lower.includes("parse")
    ) {
      return "Pata AI extracts landmarks, locality, city and pincode from messy Indian addresses using AI.";
    }

    if (
      lower.includes("landmark")
    ) {
      return "Landmarks are verified using OpenStreetMap to improve delivery accuracy.";
    }

    if (
      lower.includes("pincode")
    ) {
      return "Pincodes are verified using the India Post Pincode dataset.";
    }

    if (
      lower.includes("confidence")
    ) {
      return "Confidence is calculated after AI parsing, landmark verification and pincode validation.";
    }

    if (
      lower.includes("map") ||
      lower.includes("location")
    ) {
      return "The verified location is displayed on OpenStreetMap with accurate coordinates.";
    }

    if (
      lower.includes("ai")
    ) {
      return "Pata uses a multi-agent AI workflow: Address Parser → Landmark Verification → Pincode Validation → Confidence Engine.";
    }

    return "Try asking about address parsing, landmarks, pincodes, confidence score or map verification.";
  };

  return (
    <div>

      {/* Floating Button */}

      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full w-16 h-16 shadow-xl hover:bg-blue-700 transition text-2xl"
      >
        🤖
      </button>

      {/* Chat Window */}

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-xl shadow-2xl border">

          <div className="bg-blue-700 text-white px-4 py-3 rounded-t-xl font-bold">
            📍 Pata AI Assistant
          </div>

          <div className="p-3 h-72 overflow-y-auto space-y-2 text-sm">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`p-3 rounded-lg ${
                  msg.role === "bot"
                    ? "bg-gray-100 text-left"
                    : "bg-blue-100 text-right"
                }`}
              >
                {msg.text}
              </div>

            ))}

          </div>

          <div className="flex border-t">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Pata AI..."
              className="flex-grow px-3 py-2 outline-none"
            />

            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-5"
            >
              Send
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default FloatingChatbot;