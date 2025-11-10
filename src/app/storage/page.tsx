"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function StoragePage() {
  const router = useRouter();
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const bucket = "videos"; // ensure this bucket exists in Supabase storage

  const refreshList = useCallback(async () => {
    const { data, error } = await supabase.storage.from(bucket).list();
    if (!error && data) setFiles(data.map((f: { name: string }) => f.name));
  }, [bucket]);

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/login");
        return;
      }
      await refreshList();
      setLoading(false);
    })();
  }, [router, refreshList]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { error } = await supabase.storage.from(bucket).upload(`${Date.now()}-${file.name}`, file, { upsert: false });
    if (!error) await refreshList();
  }

  return (
    <main className="min-h-screen bg-white text-[#0b1014]">
      <div className="mx-auto max-w-2xl px-6 pt-24">
        <h1 className="font-semibold text-2xl">Storage</h1>
        <p className="mt-2 text-sm text-black/60">Authenticated example: upload and list files in the <code>{bucket}</code> bucket.</p>
        <div className="mt-6">
          <input type="file" onChange={onUpload} className="block" />
        </div>
        <div className="mt-8">
          <h2 className="font-medium">Files</h2>
          {loading ? (
            <p className="text-sm text-black/60 mt-2">Loading…</p>
          ) : files.length === 0 ? (
            <p className="text-sm text-black/60 mt-2">No files yet.</p>
          ) : (
            <ul className="mt-2 list-disc pl-5 text-sm">
              {files.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
