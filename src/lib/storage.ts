import { v4 as uuidv4 } from "uuid";
import type { CreateLoveRequestInput, LoveRequest } from "@/types";
import { createServerClient, mapDbToLoveRequest, type DbLoveRequest } from "./supabase";
import fs from "fs";
import path from "path";

// ---------- Local storage (reliable for dev) ----------

function getDataPaths() {
  const cwd = process.cwd();
  const dataDir = path.join(cwd, ".data");
  const dataFile = path.join(dataDir, "love_requests.json");
  return { cwd, dataDir, dataFile };
}

// In-memory cache
const memoryStore = new Map<string, LoveRequest & { edit_token: string }>();

function ensureDataDir(dataDir: string) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch (e) {
    console.error("[storage] Failed to create .data dir:", e);
  }
}

function loadFromDisk(): number {
  const { dataDir, dataFile, cwd } = getDataPaths();
  try {
    ensureDataDir(dataDir);
    if (!fs.existsSync(dataFile)) {
      console.log(`[storage] No data file at ${dataFile} (cwd=${cwd})`);
      return 0;
    }
    const raw = fs.readFileSync(dataFile, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, LoveRequest & { edit_token: string }>;
    let count = 0;
    for (const [id, record] of Object.entries(parsed)) {
      memoryStore.set(id, record);
      count++;
    }
    console.log(`[storage] Loaded ${count} requests from ${dataFile}`);
    return count;
  } catch (e) {
    console.error("[storage] Failed to load from disk:", e);
    return 0;
  }
}

function saveToDisk(): void {
  const { dataDir, dataFile } = getDataPaths();
  try {
    ensureDataDir(dataDir);
    const obj: Record<string, LoveRequest & { edit_token: string }> = {};
    memoryStore.forEach((value, key) => {
      obj[key] = value;
    });
    fs.writeFileSync(dataFile, JSON.stringify(obj, null, 2), "utf-8");
    console.log(`[storage] Saved ${memoryStore.size} requests to disk`);
  } catch (e) {
    console.error("[storage] Failed to save to disk:", e);
  }
}

function isLocalMode(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const forceLocal = process.env.USE_LOCAL_STORAGE === "true";
  return (
    forceLocal ||
    !supabaseUrl ||
    supabaseUrl.includes("placeholder") ||
    supabaseUrl.includes("your-project")
  );
}

// ---------- Public API ----------

export async function createLoveRequest(
  input: CreateLoveRequestInput
): Promise<{ request: LoveRequest; editToken: string; shareUrl: string }> {
  // Always reload first so we don't overwrite other process writes
  loadFromDisk();

  const id = uuidv4().replace(/-/g, "").slice(0, 12);
  const editToken = uuidv4();

  const record: LoveRequest & { edit_token: string } = {
    id,
    title: input.title.trim(),
    question: input.question.trim(),
    subtitle: input.subtitle?.trim() || null,
    sad_gif_url: input.sad_gif_url?.trim() || null,
    happy_gif_url: input.happy_gif_url?.trim() || null,
    yes_message: input.yes_message?.trim() || null,
    yes_button_text: input.yes_button_text?.trim() || "آرههه، قبول! ❤️",
    no_button_text: input.no_button_text?.trim() || "نه 🙈",
    theme: input.theme || "pink-romance",
    accent_color: input.accent_color || null,
    sender_name: input.sender_name?.trim() || null,
    intro_message: input.intro_message?.trim() || null,
    final_message: input.final_message?.trim() || null,
    created_at: new Date().toISOString(),
    expires_at: input.expires_at || null,
    yes_count: 0,
    no_count: 0,
    edit_token: editToken,
  };

  if (isLocalMode()) {
    memoryStore.set(id, record);
    saveToDisk();
    console.log(`[storage] Created local request: ${id}`);
  } else {
    const supabase = createServerClient();
    const { error } = await supabase.from("love_requests").insert({
      id: record.id,
      title: record.title,
      question: record.question,
      subtitle: record.subtitle,
      sad_gif_url: record.sad_gif_url,
      happy_gif_url: record.happy_gif_url,
      yes_message: record.yes_message,
      yes_button_text: record.yes_button_text,
      no_button_text: record.no_button_text,
      theme: record.theme,
      accent_color: record.accent_color,
      sender_name: record.sender_name,
      intro_message: record.intro_message,
      final_message: record.final_message,
      created_at: record.created_at,
      expires_at: record.expires_at,
      yes_count: 0,
      no_count: 0,
      edit_token: editToken,
    });

    if (error) {
      console.error("[storage] Supabase insert error:", error);
      memoryStore.set(id, record);
      saveToDisk();
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return {
    request: { ...record, edit_token: undefined },
    editToken,
    shareUrl: `${baseUrl}/love/${id}`,
  };
}

export async function getLoveRequest(id: string): Promise<LoveRequest | null> {
  console.log(`[storage] getLoveRequest called with id="${id}"`);
  console.log(`[storage] isLocalMode=${isLocalMode()}, cwd=${process.cwd()}`);

  if (!id || typeof id !== "string") {
    console.log("[storage] Invalid id");
    return null;
  }

  // Always reload from disk on every get (critical for multi-process Next.js)
  loadFromDisk();

  const record = memoryStore.get(id);

  if (record) {
    console.log(`[storage] Found request ${id} in memory/disk`);
    if (record.expires_at && new Date(record.expires_at) < new Date()) {
      console.log(`[storage] Request ${id} is expired`);
      return null;
    }
    const { edit_token, ...rest } = record;
    return rest;
  }

  // Try Supabase if not pure local
  if (!isLocalMode()) {
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from("love_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        const row = data as DbLoveRequest;
        if (row.expires_at && new Date(row.expires_at) < new Date()) return null;
        return mapDbToLoveRequest(row);
      }
    } catch (e) {
      console.error("[storage] Supabase get error:", e);
    }
  }

  console.log(`[storage] Request NOT found: ${id}. Known ids: [${Array.from(memoryStore.keys()).join(", ")}]`);
  return null;
}

export async function incrementYes(id: string): Promise<void> {
  loadFromDisk();
  const record = memoryStore.get(id);
  if (record) {
    record.yes_count = (record.yes_count || 0) + 1;
    memoryStore.set(id, record);
    saveToDisk();
  }

  if (!isLocalMode()) {
    try {
      const supabase = createServerClient();
      const { data } = await supabase
        .from("love_requests")
        .select("yes_count")
        .eq("id", id)
        .single();
      if (data) {
        await supabase
          .from("love_requests")
          .update({ yes_count: (data.yes_count || 0) + 1 })
          .eq("id", id);
      }
    } catch {
      // ignore
    }
  }
}

export async function incrementNo(id: string): Promise<void> {
  loadFromDisk();
  const record = memoryStore.get(id);
  if (record) {
    record.no_count = (record.no_count || 0) + 1;
    memoryStore.set(id, record);
    saveToDisk();
  }

  if (!isLocalMode()) {
    try {
      const supabase = createServerClient();
      const { data } = await supabase
        .from("love_requests")
        .select("no_count")
        .eq("id", id)
        .single();
      if (data) {
        await supabase
          .from("love_requests")
          .update({ no_count: (data.no_count || 0) + 1 })
          .eq("id", id);
      }
    } catch {
      // ignore
    }
  }
}
