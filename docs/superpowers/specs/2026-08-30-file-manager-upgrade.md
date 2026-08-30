# Design Spec: File Manager Upgrade (Monaco & Upload)

**Date:** 2026-08-30
**Topic:** file-manager-upgrade
**Status:** Proposed

## 1. Overview
The current file manager uses a simple `<textarea>` for editing and lacks an upload mechanism. This spec details how to integrate `@monaco-editor/react` for a rich editing experience and how to implement a secure file upload pipeline via a new proxy endpoint.

## 2. Architecture

### 2.1 Dependencies
- Install `@monaco-editor/react`.

### 2.2 File Upload Pipeline
Directly uploading from the client to the Pterodactyl node (Wings) is typically blocked by CORS. Therefore, we will proxy the upload through our Next.js backend.
1. **New API Route (`/api/upload/route.ts`)**:
   - Accepts `multipart/form-data`.
   - Receives `file`, `panelId`, `identifier`, and `directory`.
   - Authenticates the user and decrypts the Pterodactyl API key.
   - **Step 1:** Sends a `GET` request to `/api/client/servers/{identifier}/files/upload` to get a signed Wings upload URL.
   - **Step 2:** Sends a `POST` request to the signed URL with the file attached as `FormData`.
2. **Client Implementation**:
   - Add a hidden `<input type="file" />` triggered by a new "Upload" button.
   - On selection, construct a `FormData` object and POST it to `/api/upload`.
   - Show loading state and refresh the file list on success.

### 2.3 Monaco Editor Integration
- Replace the existing `<textarea>` in `FilesModule.tsx` with the `<Editor />` component from `@monaco-editor/react`.
- Configure the theme to `vs-dark` (or match our custom Deep Ink / Meadow theme by defining a custom monaco theme, though `vs-dark` is standard).
- **Language Detection:** Dynamically determine the `language` prop based on the `selectedFile.name` extension (e.g., `.json` -> `json`, `.js` -> `javascript`, `.yml` -> `yaml`).
- Wire the editor's `onChange` event to update the `editContent` state.

## 3. Trade-offs & Limitations
- Proxying file uploads routes traffic through our Next.js/Vercel server, which may be subject to Vercel's payload size limits (typically 4.5MB for Serverless Functions). For very large files (like game server archives), this will fail. For configuration files and plugins, this is perfectly fine.
- To handle huge files in the future, we would need to configure CORS directly on the Pterodactyl Wings node, which is outside the scope of this web app.

## 4. Next Steps
1. Create `/api/upload/route.ts`.
2. Install `@monaco-editor/react`.
3. Update `FilesModule.tsx`.
