import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const typeText = (text, setMessages, index, speed = 15) => {
  let i = 0;

  const interval = setInterval(() => {
    setMessages(prev => {
      const updated = [...prev];
      updated[index].content = text.slice(0, i);
      return updated;
    });

    i++;
    if (i > text.length) clearInterval(interval);
  }, speed);
};

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { role: "user", content: input };
  setMessages(prev => [...prev, userMsg]);
  setInput("");

  // Add placeholder AI message
  const aiIndex = messages.length + 1;
  setMessages(prev => [...prev, { role: "assistant", content: "" }]);

  const res = await fetch("https://guru-ji-ai-backend-1.onrender.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMsg.content })
  });

  const data = await res.json();

  // Typing animation
  typeText(data.reply, setMessages, aiIndex);
};


  return (
    <div className="p-4 max-w-7xl max-h-[95%] mx-auto flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-center text-blue-500 underline">GuruJI</h2>

  <div className="max-h-[90%] overflow-hidden scroll-smooth mt-5 p-4 rounded-lg mb-10 max-w-4xl mx-auto">

  {messages.map((msg, i) => (
  <div
    key={i}
    className={`flex mb-4 ${
      msg.role === "user" ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={`px-4 py-3 rounded-lg max-w-[75%] ${
        msg.role === "user"
          ? "bg-blue-600 text-white rounded-br-none"
          : "bg-gray-100 text-gray-900 rounded-bl-none"
      }`}
    >
      {msg.role === "assistant" ? (
        <div className={`ai-message ${msg.content === "" ? "typing" : ""}`}>

          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {msg.content}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="whitespace-pre-wrap">{msg.content}</p>
      )}
    </div>
  </div>
))}

  </div>
  <div className="flex w-[85%] h-[10%] items-center justify-evenly fixed bottom-4 left-1/2 transform -translate-x-1/2">

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask anything to GuruJI..."
        className="bg-blue-300 w-[94%] border-none shadow-blue-300 shadow-lg text-black p-2 rounded-full mt-4 focus:bg-blue-400 outline-none transition-colors"
      />
      <button
        onClick={sendMessage}
        aria-label="Send message"
        className="ml-2 bg-blue-500 text-white rounded-full mt-4 shadow-blue-300 shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center w-12 h-12 p-2"
      >
        <span className="flex items-center justify-center w-full h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </span>
      </button>
      </div>
    </div>
  );
}

export default App;
