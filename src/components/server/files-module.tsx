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
          panelId: server.panel_id,
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
      // Open file editor
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
          panelId: server.panel_id,
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
          panelId: server.panel_id,
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
          panelId: server.panel_id,
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
    <div className="glass-card rounded-[16px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-[16px] text-white">Files</h2>
        <button onClick={() => listFiles(currentPath)} className="pill-ghost rounded-full px-3 py-1.5 text-[12px] font-medium text-white">Refresh</button>
      </div>

      {loading ? (
        <div className="text-[13px] text-[#9da7ba] py-8 text-center">Loading...</div>
      ) : showEditor && selectedFile ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#c7d3ea] font-mono">{selectedFile.path}</span>
            <div className="flex gap-2">
              <button onClick={() => setShowEditor(false)} className="pill-ghost rounded-full px-3 py-1.5 text-[12px] text-white">Cancel</button>
              <button onClick={saveFile} className="flash-violet rounded-full px-3 py-1.5 text-[12px] font-medium text-white">Save</button>
            </div>
          </div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-[500px] bg-[#0a0a14] border border-[rgba(186,215,247,0.12)] rounded-[10px] p-4 font-mono text-[12px] text-[#c7d3ea] resize-none"
          />
        </div>
      ) : (
        <>
          <div className="text-[11px] text-[#9da7ba] mb-3 font-mono">{currentPath}</div>
          <div className="border border-[rgba(186,215,247,0.08)] rounded-[10px] overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[rgba(186,214,247,0.04)] text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">
                <tr>
                  <th className="px-4 py-2.5 font-normal">Name</th>
                  <th className="px-4 py-2.5 font-normal hidden sm:table-cell">Size</th>
                  <th className="px-4 py-2.5 font-normal hidden md:table-cell">Modified</th>
                  <th className="px-4 py-2.5 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(186,215,247,0.06)]">
                {files.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-[#9da7ba]">Empty folder</td></tr>
                ) : files.map((file) => (
                  <tr key={file.path} className="hover:bg-[rgba(186,214,247,0.04)] group">
                    <td className="px-4 py-2.5">
                      <button onClick={() => navigate(file.path)} className="text-[#d1e4fa] hover:text-white flex items-center gap-2">
                        <span>{file.type === "folder" ? "📁" : "📄"}</span>
                        {file.name}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-[#9da7ba] hidden sm:table-cell">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : "—"}</td>
                    <td className="px-4 py-2.5 text-[#9da7ba] text-[11px] hidden md:table-cell">{file.modified || "—"}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => deleteFile(file.path)} className="text-[#e46d4c] hover:text-[#ff7d6a] text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
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
