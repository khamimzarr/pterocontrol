# Design Spec: Interactive Terminal Console (xterm.js)

**Date:** 2026-08-30
**Topic:** console-xterm
**Status:** Approved

## 1. Overview
The server control view currently contains a placeholder console. This spec outlines the implementation of a fully interactive, real-time terminal using `xterm.js` and WebSocket connections to the Pterodactyl Wings daemon, mimicking the original panel's console experience.

## 2. Architecture

### 2.1 Dependencies
- Install `xterm` and `xterm-addon-fit`.

### 2.2 Server Action (Authentication Proxy)
- Create or modify a Server Action (or use the existing `/api/proxy` endpoint) to fetch WebSocket credentials.
- Input: `panelId` (the linked panel ID in Supabase) and `identifier` (the server's UUID).
- Action:
  1. Retrieve and decrypt the API key for `panelId` from the `linked_panels` table.
  2. Perform a `GET` request to the Pterodactyl API: `/api/client/servers/{identifier}/websocket`.
  3. Return the `token` and `socket` (WebSocket URL) securely to the client.

### 2.3 Client Component (`ConsoleModule.tsx`)
- Replace the current dummy log `div` with an `xterm.js` instance.
- On mount (and if server state is not offline), request the WebSocket credentials via the Server Action/Proxy.
- Initialize `xterm.js` and the `xterm-addon-fit` to ensure the terminal sizes correctly to the container.
- Open a native browser `WebSocket` connection to the provided `socket` URL.
- Handle WebSocket lifecycle:
  - **On Open:** Send authentication payload `{"event":"auth","args":["<token>"]}`.
  - **On Message:** Parse JSON. If `event === 'console output'`, write the joined `args` strings to the `xterm.js` instance using `term.write()`.
  - **On Close/Error:** Display disconnection messages inside the terminal and handle reconnect logic if applicable.
- Handle Terminal Input:
  - Provide a command input field below the terminal. We will retain the existing input field but wire it up to send `{"event":"send command","args":["<command>"]}` to the WebSocket.

## 3. Trade-offs & Limitations
- **Session History:** The WebSocket only provides live logs. Previous logs (history) will not be displayed unless fetched separately. For MVP, live logs are sufficient, mirroring standard daemon attachment.

## 4. Next Steps
1. Install `xterm` dependencies.
2. Implement backend credential fetching.
3. Rewrite `ConsoleModule.tsx`.
