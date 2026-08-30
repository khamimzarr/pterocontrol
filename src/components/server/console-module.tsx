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

    // Connect to Pterodactyl WebSocket
    const protocol = panelUrl.startsWith("https") ? "wss://" : "ws://";
    const wsUrl = `${protocol}${new URL(panelUrl).host}/api/client/servers/${identifier}/websocket?token=`;
    
    // Note: Real websocket requires a token from the panel API
    // For now, show message that console requires proper auth
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
    // Would send via WebSocket in real implementation
    setInput("");
  };

  return (
    <div className="glass-card rounded-[16px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-[16px] text-white">Console</h2>
        <span className={`text-[12px] flex items-center gap-1.5 ${connected ? "text-[#28c840]" : "text-[#e46d4c]"}`}>
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-[#28c840] animate-pulse-dot" : "bg-[#e46d4c]"}`} />
          {connected ? "Connected" : "Offline / Auth Required"}
        </span>
      </div>

      <div className="bg-[#0a0a14] rounded-[10px] border border-[rgba(186,215,247,0.08)] p-4 font-mono text-[12px] text-[#c7d3ea] h-[400px] overflow-y-auto space-y-1">
        {messages.map((msg, i) => (
          <div key={i} className={`${msg.startsWith("[") ? "text-[#9da7ba] italic" : msg.startsWith(">") ? "text-[#663af3]" : ""}`}>
            {msg}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="mt-3 text-[12px] text-[#e46d4c] bg-[rgba(228,109,76,0.08)] border border-[rgba(228,109,76,0.15)] rounded-[8px] px-3 py-2">
          {error}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!connected}
          placeholder={connected ? "Type command..." : "Console unavailable"}
          className="auth-input flex-1 px-3 py-2 text-[13px] disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={!connected || !input.trim()}
          className="flash-violet rounded-[6px] px-4 py-2 text-[13px] font-medium disabled:opacity-50"
        >
          Send
        </button>
      </div>

      <p className="mt-3 text-[11px] text-[#9da7ba]">
        For full console access, use the panel directly or implement WebSocket with proper token authentication.
      </p>
    </div>
  );
}
