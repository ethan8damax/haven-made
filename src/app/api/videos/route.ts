import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

const R2_ENDPOINT = process.env.R2_ENDPOINT as string | undefined;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID as string | undefined;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY as string | undefined;
const R2_BUCKET = (process.env.R2_BUCKET as string | undefined) || "client-videos";

function getS3Client() {
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return null;
  return new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function GET(req: NextRequest) {
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Server is missing SUPABASE keys or URL" },
      { status: 500 }
    );
  }
  const s3 = getS3Client();
  if (!s3) {
    return NextResponse.json(
      { error: "Missing R2 configuration (R2_ENDPOINT/ACCESS_KEY_ID/SECRET_ACCESS_KEY)" },
      { status: 500 }
    );
  }

  // Verify caller via Supabase using the access token from Authorization header
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const adminClient = createClient(supabaseUrl, serviceKey);
  const { data: userRes, error: userErr } = await adminClient.auth.getUser(token);
  if (userErr || !userRes?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = userRes.user.id;

  // Fetch user's client_videos rows
  const { data: rows, error: rowsErr } = await adminClient
    .from("client_videos")
    .select("video_path,title,wedding_date")
    .eq("user_id", userId)
    .order("inserted_at", { ascending: false });
  if (rowsErr) {
    return NextResponse.json({ error: rowsErr.message }, { status: 500 });
  }

  // Sign each object for 1 hour
  const results = await Promise.all(
    (rows || []).map(async (r: any) => {
      const key = r.video_path as string;
      try {
        const command = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return {
          title: r.title || "Your Film",
          wedding_date: r.wedding_date || null,
          video_path: key,
          signedUrl,
        };
      } catch (e: any) {
        return {
          title: r.title || "Your Film",
          wedding_date: r.wedding_date || null,
          video_path: key,
          signedUrl: null,
          error: e?.message || "Failed to sign URL",
        };
      }
    })
  );

  return NextResponse.json({ videos: results });
}
