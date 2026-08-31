"use client";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import "xterm/css/xterm.css";

interface ConsoleModuleProps {
  server: any;
  identifier: string;
  panelUrl: string;
}

export function ConsoleModule({ server, identifier, panelUrl }: ConsoleModuleProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize Terminal
    term.current = new Terminal({
      theme: {
        background: '#1e293b',
        foreground: '#f8fafc',
        cursor: '#f8fafc',
        black: '#0f172a',
        red: '#ff5f56',
        green: '#27c93f',
        yellow: '#ffbd2e',
        blue: '#3b82f6',
        magenta: '#d946ef',
        cyan: '#06b6d4',
        white: '#ffffff',
      },
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: 13,
      disableStdin: true,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.current.loadAddon(fitAddon);
    term.current.open(terminalRef.current);
    
    // Slight delay to ensure DOM is ready for measurement
    setTimeout(() => fitAddon.fit(), 10);

    term.current.writeln("\x1b[33m[PteroControl]\x1b[0m Requesting console access...");

    let isComponentMounted = true;

    const connectWebSocket = async () => {
      try {
        const res = await fetch("/api/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            panelId: server.id,
            identifier,
            path: "websocket",
            method: "GET",
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to get WebSocket credentials");
        }

        const data = await res.json();
        const token = data.data?.token;
        const socketUrl = data.data?.socket;

        term.current?.writeln("\x1b[36m[Debug]\x1b[0m Fetched credentials...");
        
        if (!token || !socketUrl) {
          term.current?.writeln(`\x1b[31m[Debug]\x1b[0m Invalid response: ${JSON.stringify(data)}`);
          throw new Error("Invalid WebSocket response from panel");
        }
        
        term.current?.writeln(`\x1b[36m[Debug]\x1b[0m Connecting to ${socketUrl}...`);

        if (!isComponentMounted) return;

        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => {
          setConnected(true);
          setError(null);
          term.current?.writeln("\x1b[32m[Debug]\x1b[0m WebSocket connected. Authenticating...");
          ws.current?.send(JSON.stringify({ event: "auth", args: [token] }));
        };

        ws.current.onmessage = (e) => {
          try {
            const payload = JSON.parse(e.data);
            if (payload.event === "auth success") {
              term.current?.writeln("\x1b[32m[PteroControl]\x1b[0m Authentication successful. Connecting to daemon...");
              ws.current?.send(JSON.stringify({ event: "send logs", args: [] }));
            }
            if (payload.event === "console output") {
              payload.args.forEach((log: string) => {
                term.current?.writeln(log);
              });
            }
            if (payload.event === "status") {
              term.current?.writeln(`\x1b[33m[Daemon]\x1b[0m Server status: ${payload.args[0]}`);
            }
          } catch (err) {
            console.error("WS Parse error", err);
          }
        };

        ws.current.onerror = (evt) => {
          console.error("WS Error", evt);
          term.current?.writeln("\x1b[31m[Debug]\x1b[0m WebSocket error occurred (Check console for CORS/Mixed Content).");
          setError("WebSocket encountered an error.");
          setConnected(false);
        };

        ws.current.onclose = () => {
          setConnected(false);
          term.current?.writeln("\x1b[31m[PteroControl]\x1b[0m Connection closed.");
        };

      } catch (err) {
        if (!isComponentMounted) return;
        setError(err instanceof Error ? err.message : "Failed to connect to console");
        term.current?.writeln(`\x1b[31m[Error]\x1b[0m ${err instanceof Error ? err.message : "Connection failed"}`);
      }
    };

    connectWebSocket();

    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isComponentMounted = false;
      window.removeEventListener("resize", handleResize);
      if (ws.current) {
        ws.current.close();
      }
      if (term.current) {
        term.current.dispose();
      }
    };
  }, [server.id, identifier]);

  const sendMessage = () => {
    if (!input.trim() || !connected || !ws.current) return;
    ws.current.send(JSON.stringify({ event: "send command", args: [input] }));
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

      <div className="bg-[#1e293b] rounded-xl border border-deep-ink/10 overflow-hidden shadow-inner">
        {/* Mac-like Header */}
        <div className="bg-[#0f172a] px-4 py-3 flex items-center border-b border-white/5">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[#94a3b8] text-[11px] font-mono font-medium ml-4 tracking-wide uppercase">root@{identifier.slice(0, 8)}:~#</span>
        </div>
        <div className="p-4 bg-[#1e293b]">
          <div ref={terminalRef} className="h-[400px] w-full" />
        </div>
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
    </div>
  );
}