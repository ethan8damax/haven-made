import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAILS = [
  "ethandouglasmaxey@gmail.com",
  "carolinejoy.mose@gmail.com",
];

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

export async function POST(req: NextRequest) {
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

  const adminClient = createClient(supabaseUrl, serviceKey);

  // Verify caller is admin
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  try {
    const { data: userRes, error: userErr } = await adminClient.auth.getUser(token);
    if (userErr || !userRes?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const email = userRes.user.email.toLowerCase();
    const isAdmin = ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email);
    if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse multipart form data
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const userId = (form.get("userId") as string) || "";
  const clientEmail = (form.get("clientEmail") as string) || "";
  const title = (form.get("title") as string) || null;
  const wedding_date = (form.get("wedding_date") as string) || null;

  if (!file || (!userId && !clientEmail)) {
    return NextResponse.json({ error: "Missing file or user identifier" }, { status: 400 });
  }

  // Resolve user id if only clientEmail provided
  let targetUserId = userId;
  if (!targetUserId && clientEmail) {
    // Try to find existing user
    let foundId: string | null = null;
    let page = 1;
    while (page <= 10 && !foundId) {
      const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 100 });
      if (error) break;
      for (const u of data.users) {
        if ((u.email || "").toLowerCase() === clientEmail.toLowerCase()) {
          foundId = u.id;
          break;
        }
      }
      if (foundId) break;
      if (data.users.length < 100) break;
      page += 1;
    }
    if (!foundId) {
      const { data: inviteData, error: inviteErr } = await adminClient.auth.admin.inviteUserByEmail(clientEmail);
      if (inviteErr) return NextResponse.json({ error: inviteErr.message }, { status: 500 });
      foundId = inviteData?.user?.id || "";
    }
    targetUserId = foundId || "";
  }

  if (!targetUserId) {
    return NextResponse.json({ error: "Could not resolve user" }, { status: 400 });
  }

  // Upload to R2
  const arrayBuffer = await file.arrayBuffer();
  const body = Buffer.from(arrayBuffer);
  const cleanName = file.name.replace(/\s+/g, "-");
  const key = `client_videos/${Date.now()}-${cleanName}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: body,
        ContentType: file.type || "application/octet-stream",
      })
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "R2 upload failed" }, { status: 500 });
  }

  // Insert client_videos with R2 object key as video_path
  const { error: insertErr } = await adminClient.from("client_videos").insert({
    user_id: targetUserId,
    video_path: key,
    title: title ?? null,
    wedding_date: wedding_date ?? null,
  });
  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, key });
}
