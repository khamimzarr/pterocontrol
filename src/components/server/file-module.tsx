"use client";

import { useState, useEffect } from "react";

interface FileObject {
  name: string;
  mode: string;
  mode_bits: string;
  size: number;
  is_file: boolean;
  is_symlink: boolean;
  mimetype: string;
  created_at: string;
  modified_at: string;
}

export function FileModule({ server, identifier }: { server: any, identifier: string }) {
  const [currentDir, setCurrentDir] = useState("/");
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor state
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [saving, setSaving] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async (dir: string = currentDir) => {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelId: server.id,
          identifier,
          path: `files/list?directory=${encodeURIComponent(dir)}`,
          method: "GET"
        }),
      });
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setFiles(data.data.map((item: any) => item.attributes));
      setCurrentDir(dir);
    } catch (err) {
      alert("Error loading files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles("/");
  }, [server.id, identifier]);

  const handleNavigate = (dirName: string) => {
    if (dirName === "..") {
      const parts = currentDir.split("/").filter(Boolean);
      parts.pop();
      fetchFiles("/" + parts.join("/"));
    } else {
      const newDir = currentDir === "/" ? `/${dirName}` : `${currentDir}/${dirName}`;
      fetchFiles(newDir);
    }
  };

  const openEditor = async (fileName: string) => {
    setEditingFile(fileName);
    setFileContent("Loading...");
    try {
      const filePath = currentDir === "/" ? `/${fileName}` : `${currentDir}/${fileName}`;
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelId: server.id,
          identifier,
          path: `files/contents?file=${encodeURIComponent(filePath)}`,
          method: "GET"
        }),
      });
      if (!res.ok) throw new Error("Failed to load file");
      const data = await res.json();
      setFileContent(data.data || "");
    } catch (err) {
      alert("Failed to read file");
      setEditingFile(null);
    }
  };

  const saveFile = async () => {
    if (!editingFile) return;
    setSaving(true);
    try {
      const filePath = currentDir === "/" ? `/${editingFile}` : `${currentDir}/${editingFile}`;
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelId: server.id,
          identifier,
          path: `files/write?file=${encodeURIComponent(filePath)}`,
          method: "POST",
          rawText: fileContent
        }),
      });
      if (!res.ok) throw new Error("Failed to save file");
      alert("File saved successfully");
      setEditingFile(null);
    } catch (err) {
      alert("Failed to save file");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // 1. Get signed URL
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelId: server.id,
          identifier,
          path: `files/upload`,
          method: "GET"
        }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const data = await res.json();
      let uploadUrl = data.attributes?.url;
      
      if (!uploadUrl) throw new Error("No upload URL returned");
      
      // 2. Upload directly to the node (bypasses vercel limits)
      const formData = new FormData();
      formData.append("files", file);

      const uploadTarget = `${uploadUrl}&directory=${encodeURIComponent(currentDir)}`;
      
      const uploadReq = await fetch(uploadTarget, {
        method: "POST",
        body: formData,
      });

      if (!uploadReq.ok) throw new Error("Upload to node failed");
      
      alert("File uploaded!");
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert("Upload failed. Ensure CORS allows this domain.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const decompressFile = async (fileName: string) => {
    const confirm = window.confirm(`Extract ${fileName}?`);
    if (!confirm) return;
    console.log("Extracting...");
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelId: server.id,
          identifier,
          path: `files/decompress`,
          method: "POST",
          data: { root: currentDir, file: fileName }
        }),
      });
      if (!res.ok) throw new Error("Failed to extract");
      alert("Extraction complete");
      fetchFiles();
    } catch (err) {
      alert("Failed to extract");
    }
  };

  // Sort: folders first, then files alphabetically
  const sortedFiles = [...files].sort((a, b) => {
    if (a.is_file === b.is_file) return a.name.localeCompare(b.name);
    return a.is_file ? 1 : -1;
  });

  return (
    <div className="rounded-xl bg-white p-6 md:p-8 border border-deep-ink/5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink">File Manager</h2>
          <p className="text-body-sm text-slate mt-1 font-mono">{currentDir}</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => fetchFiles()} className="btn-secondary py-2 text-sm">
            Refresh
          </button>
          
          <label className="btn-primary py-2 text-sm cursor-pointer whitespace-nowrap">
            {uploading ? "Uploading..." : "Upload File"}
            <input type="file" className="hidden" disabled={uploading} onChange={handleUpload} />
          </label>
        </div>
      </div>

      {editingFile ? (
        <div className="border border-deep-ink/10 rounded-xl overflow-hidden flex flex-col bg-[#1e293b]">
          <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between border-b border-white/5">
            <span className="text-[#94a3b8] text-sm font-mono">{editingFile}</span>
            <div className="flex gap-2">
              <button onClick={() => setEditingFile(null)} className="px-3 py-1 text-xs text-white bg-red-500/20 hover:bg-red-500/40 rounded transition-colors">Cancel</button>
              <button onClick={saveFile} disabled={saving} className="px-3 py-1 text-xs text-[#0f172a] bg-[#27c93f] hover:bg-[#27c93f]/80 rounded transition-colors font-medium">
                {saving ? "Saving..." : "Save File"}
              </button>
            </div>
          </div>
          <textarea
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            className="w-full h-[500px] bg-[#1e293b] text-[#f8fafc] font-mono text-sm p-4 outline-none resize-y"
            spellCheck="false"
          />
        </div>
      ) : (
        <div className="border border-deep-ink/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-soft-meadow border-b border-deep-ink/10 text-caption font-medium tracking-wide uppercase text-slate">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 w-32">Size</th>
                  <th className="px-4 py-3 w-48 hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-deep-ink/5">
                {currentDir !== "/" && (
                  <tr 
                    onClick={() => handleNavigate("..")}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <span className="text-xl">📁</span>
                      <span className="font-medium text-deep-ink">..</span>
                    </td>
                    <td className="px-4 py-3 text-slate text-sm">--</td>
                    <td className="px-4 py-3 text-slate text-sm hidden md:table-cell">--</td>
                    <td className="px-4 py-3 text-right"></td>
                  </tr>
                )}
                
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate">Loading files...</td>
                  </tr>
                ) : sortedFiles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate">Directory is empty</td>
                  </tr>
                ) : (
                  sortedFiles.map((file) => (
                    <tr 
                      key={file.name}
                      onClick={() => !file.is_file ? handleNavigate(file.name) : null}
                      className={`${!file.is_file ? 'cursor-pointer' : ''} hover:bg-surface-soft-meadow transition-colors`}
                    >
                      <td className="px-4 py-3 flex items-center gap-3">
                        <span className="text-xl">{file.is_file ? (file.name.endsWith('.zip') ? '📦' : '📄') : '📁'}</span>
                        <span className={`font-medium ${!file.is_file ? 'text-primary-forest' : 'text-deep-ink'}`}>
                          {file.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate text-sm">
                        {file.is_file ? (file.size / 1024).toFixed(1) + " KB" : "--"}
                      </td>
                      <td className="px-4 py-3 text-slate text-sm hidden md:table-cell">
                        {new Date(file.modified_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {file.is_file && file.name.endsWith('.zip') && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); decompressFile(file.name); }}
                              className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded"
                            >
                              Extract
                            </button>
                          )}
                          {file.is_file && file.size < 5 * 1024 * 1024 && !file.name.endsWith('.zip') && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); openEditor(file.name); }}
                              className="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
