"use client";
import { useEffect, useRef, useState } from "react";

interface ConsoleModuleProps {
  server: any;
  identifier: string;
  panelUrl: string;
}

export function ConsoleModule({ server, identifier, panelUrl }: ConsoleModuleProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (server.state !== "online") {
      setMessages((prev) => [...prev, "[Server is offline]"]);
      return;
    }

    const protocol = panelUrl.startsWith("https") ? "wss://" : "ws://";
    const wsUrl = `${protocol}${new URL(panelUrl).host}/api/client/servers/${identifier}/websocket?token=`;
    
    setMessages((prev) => [...prev, "[Console requires WebSocket token from panel API]"]);
    setMessages((prev) => [...prev, "[Use the panel directly for full console access]"]);
    
    setConnected(false);
    setError("WebSocket console requires additional authentication token from the panel API");

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [server.state, identifier, panelUrl]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !connected) return;
    setMessages((prev) => [...prev, `> ${input}`]);
    setInput("");
  };

  return (
    <div className="rounded-xl bg-surface-soft-meadow p-6 md:p-8 border border-deep-ink/5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink">Console</h2>
        <span className={`text-body-sm flex items-center gap-1.5 ${connected ? "text-[#59e25d]" : "text-[#e46d4c] font-medium"}`}>
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-[#59e25d] animate-pulse-dot" : "bg-[#e46d4c]"}`} />
          {connected ? "Connected" : "Offline / Auth Required"}
        </span>
      </div>

      <div className="bg-white rounded-lg border border-deep-ink/5 p-4 font-mono text-caption text-deep-ink h-[400px] overflow-y-auto space-y-1 text-[13px]">
        {messages.map((msg, i) => (
          <div key={i} className={`${msg.startsWith("[") ? "text-slate italic" : msg.startsWith(">") ? "text-hi-yellow font-semibold" : ""}`}>
            {msg}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="mt-3 text-body-sm text-[#e46d4c] bg-[#e46d4c]/10 border border-[#e46d4c]/30 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <div className="mt-3 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!connected}
          placeholder={connected ? "Type command..." : "Console unavailable"}
          className="input-pill flex-1 py-3 disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={!connected || !input.trim()}
          className="btn-primary py-3 disabled:opacity-50"
        >
          Send
        </button>
      </div>

      <p className="mt-3 text-caption text-slate">
        For full console access, use the panel directly or implement WebSocket with proper token authentication.
      </p>
    </div>
  );
}