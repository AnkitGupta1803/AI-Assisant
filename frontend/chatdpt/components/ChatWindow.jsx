"use client";
import { useState, useRef, useEffect } from "react";

// Outside component — generated once per session
const threadId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function generate(text) {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    const response = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ threadId: threadId, message: text }), 
    });

    const result = await response.json();

    setMessages((prev) => [...prev, { role: "assistant", content: result.message }]);
    setLoading(false);
  }

  async function handleAsk() {
    const text = input.trim();
    if (!text || loading) return;
    await generate(text);
  }

  async function handleEnter(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = input.trim();
      if (!text || loading) return;
      await generate(text);
    }
  }

  return (
    <>
      <div className="container mx-auto max-w-3xl pb-44 px-2">
        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <div key={i} className="my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit">
              {msg.content}
            </div>
          ) : (
            <div key={i} className="my-6 max-w-fit whitespace-pre-wrap">
              {msg.content}
            </div>
          )
        )}

        {loading && (
          <div className="my-6 animate-pulse text-neutral-400">Thinking...</div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="fixed inset-x-0 bottom-0 flex items-center justify-center bg-neutral-900">
        <div className="bg-neutral-800 p-2 rounded-3xl w-full max-w-3xl mb-3 mx-2">
          <textarea
            className="w-full resize-none outline-none p-3 bg-transparent text-white"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnter}
            placeholder="Type a message..."
          />
          <div className="flex items-center justify-end">
            <button
              onClick={handleAsk}
              disabled={loading}
              className="bg-white px-4 py-1 text-black rounded-full cursor-pointer hover:bg-gray-300 disabled:opacity-50"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </>
  );
}