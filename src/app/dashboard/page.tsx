"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const bucket = "videos";
  const [title, setTitle] = useState<string>("");
  const [weddingDate, setWeddingDate] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.replace("/login");
        return;
      }
      const user = session.user;
      const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || user.email || "Friend";
      setDisplayName(name);
      // Fetch this user's assigned video row
      const { data: row, error: rowError } = await supabase
        .from("client_videos")
        .select("video_path,title,wedding_date")
        .eq("user_id", user.id)
        .single();
      if (rowError || !row) {
        setError(rowError?.message || "No assigned video found.");
        setLoading(false);
        return;
      }
      setTitle(row.title || "Your Film");
      setWeddingDate(row.wedding_date || "");
      const { data: signed, error: signError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(row.video_path, 3600); // 1 hour expiry
      if (signError || !signed?.signedUrl) {
        setError(signError?.message || "Could not create signed URL for video.");
      } else {
        setVideoUrl(signed.signedUrl);
      }
      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-[#0b1014]">
        <div className="mx-auto max-w-2xl px-6 pt-24">
          <p className="text-sm text-black/60">Loading…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#0b1014]">
      <div className="mx-auto max-w-5xl px-6 pt-24">
        <h1 className="font-serif text-3xl">Welcome, {displayName}</h1>
        <p className="mt-2 text-black/60">Here is your dashboard.</p>

        <div className="mt-10">
          <h2 className="text-lg font-medium">{title || "Your Film Player"}</h2>
          {weddingDate && (
            <p className="text-sm text-black/60 mt-1">Wedding date: {new Date(weddingDate).toLocaleDateString()}</p>
          )}
          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
          {videoUrl ? (
            <div className="mt-3">
              <video
                controls
                className="w-full aspect-video rounded-xl border border-black/10 bg-black"
                src={videoUrl}
              />
              <div className="mt-4">
                <a
                  href={videoUrl}
                  download
                  className="inline-flex items-center rounded-full bg-[#0b1014] text-white px-5 py-2 text-sm hover:bg-black"
                >
                  Download Video
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-3 aspect-video w-full rounded-xl bg-[#0b1014]/5 border border-black/10 grid place-items-center text-black/50">
              <span>Preparing your video…</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
