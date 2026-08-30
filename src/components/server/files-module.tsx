"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/toast";

interface FilesModuleProps {
  server: any;
  identifier: string;
  panelUrl: string;
}

interface FileItem {
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: string;
  path: string;
}

export function FilesModule({ server, identifier, panelUrl }: FilesModuleProps) {
  const { push } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  const listFiles = async (path: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelId: server.id,
          identifier,
          path: `files/list?directory=${encodeURIComponent(path)}`,
          method: "GET",
        }),
      });

      if (!res.ok) throw new Error("Failed to list files");
      const data = await res.json();
      setFiles(data.data ?? []);
      setCurrentPath(path);
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listFiles(currentPath);
  }, []);

  const navigate = (path: string) => {
    if (path.endsWith("/")) {
      listFiles(path);
    } else {
      const file = files.find((f) => f.path === path);
      if (file) {
        setSelectedFile(file);
        fetchFileContent(file.path);
        setShowEditor(true);
      }
    }
  };

  const fetchFileContent = async (path: string) => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelId: server.id,
          identifier,
          path: `files/content?file=${encodeURIComponent(path)}`,
          method: "GET",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setEditContent(data.data ?? "");
      }
    } catch {
      push("Failed to read file", "err");
    }
  };

  const saveFile = async () => {
    if (!selectedFile) return;
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelId: server.id,
          identifier,
          path: `files/content?file=${encodeURIComponent(selectedFile.path)}`,
          method: "PUT",
          data: { contents: editContent },
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      push("File saved", "ok");
      setShowEditor(false);
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  const deleteFile = async (path: string) => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelId: server.id,
          identifier,
          path: `files/delete?file=${encodeURIComponent(path)}`,
          method: "DELETE",
        }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      push("Deleted", "ok");
      listFiles(currentPath);
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  return (
    <div className="rounded-xl bg-surface-soft-meadow p-6 md:p-8 border border-deep-ink/5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink">Files</h2>
        <button onClick={() => listFiles(currentPath)} className="btn-secondary py-2 text-body-sm">Refresh</button>
      </div>

      {loading ? (
        <div className="text-slate text-body-sm py-8 text-center">Loading...</div>
      ) : showEditor && selectedFile ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-deep-ink font-mono">{selectedFile.path}</span>
            <div className="flex gap-2">
              <button onClick={() => setShowEditor(false)} className="btn-ghost py-2 text-body-sm">Cancel</button>
              <button onClick={saveFile} className="btn-primary py-2 text-body-sm">Save</button>
            </div>
          </div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-[500px] bg-white border border-deep-ink/10 rounded-lg p-4 font-mono text-body-sm text-deep-ink resize-none"
          />
        </div>
      ) : (
        <>
          <div className="text-caption text-slate mb-3 font-mono">{currentPath}</div>
          <div className="border border-deep-ink/5 rounded-lg overflow-hidden bg-white">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-surface-canvas text-caption tracking-wide uppercase font-semibold text-slate">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Size</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Modified</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-deep-ink/5">
                {files.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-slate">Empty folder</td></tr>
                ) : files.map((file) => (
                  <tr key={file.path} className="hover:bg-surface-soft-meadow group">
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(file.path)} className="text-deep-ink hover:text-charcoal flex items-center gap-2 font-medium">
                        <span>{file.type === "folder" ? "📁" : "📄"}</span>
                        {file.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-caption text-slate hidden sm:table-cell">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : "—"}</td>
                    <td className="px-4 py-3 text-caption text-slate hidden md:table-cell">{file.modified || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteFile(file.path)} className="text-[#e46d4c] hover:text-[#d33] text-caption font-medium opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}