import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { decrypt } from "@/lib/encryption";
import { requireApprovedUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await requireApprovedUser();
    const body = (await request.json()) as {
      panelId: string;
      identifier: string;
      path: string;
      method?: string;
      data?: Record<string, unknown>;
    };

    if (!body.panelId || !body.identifier || !body.path) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify ownership
    const supabase = await createClient();
    const { data: serverLink } = await supabase
      .from("server_links")
      .select("id, panel_id")
      .eq("id", body.panelId)
      .eq("user_id", user.id)
      .single();

    if (!serverLink) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get panel and decrypt API key
    const { data: panel } = await supabase
      .from("linked_panels")
      .select("panel_url, encrypted_api_key")
      .eq("id", serverLink.panel_id)
      .single();

    if (!panel) {
      return NextResponse.json({ error: "Panel not found" }, { status: 404 });
    }

    let apiKey: string;
    try {
      apiKey = decrypt(panel.encrypted_api_key);
    } catch {
      return NextResponse.json({ error: "Failed to decrypt API key" }, { status: 500 });
    }

    const targetUrl = `${panel.panel_url}/api/client/servers/${body.identifier}/${body.path}`;
    const method = body.method || "GET";
    
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    };

    let fetchOptions: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    };

    if (body.data && ["POST", "PUT", "PATCH"].includes(method)) {
      fetchOptions.body = JSON.stringify(body.data);
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(targetUrl, fetchOptions);
    
    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `HTTP ${response.status}: ${text.slice(0, 200)}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    
    // Handle different response types
    if (contentType.includes("json")) {
      const json = await response.json();
      return NextResponse.json(json);
    }
    
    if (contentType.includes("text") || contentType.includes("octet-stream")) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        headers: { "Content-Type": contentType },
      });
    }

    const text = await response.text();
    return NextResponse.json({ data: text });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}

// WebSocket proxy for console
export async function GET(request: NextRequest) {
  try {
    const user = await requireApprovedUser();
    const { searchParams } = new URL(request.url);
    const panelId = searchParams.get("panelId");
    const identifier = searchParams.get("identifier");
    const path = searchParams.get("path");

    if (!panelId || !identifier || !path) {
      return new NextResponse("Missing parameters", { status: 400 });
    }

    const supabase = await createClient();
    const { data: serverLink } = await supabase
      .from("server_links")
      .select("panel_id")
      .eq("panel_id", panelId)
      .eq("user_id", user.id)
      .single();

    if (!serverLink) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { data: panel } = await supabase
      .from("linked_panels")
      .select("panel_url, encrypted_api_key")
      .eq("id", serverLink.panel_id)
      .single();

    if (!panel) {
      return new NextResponse("Panel not found", { status: 404 });
    }

    let apiKey: string;
    try {
      apiKey = decrypt(panel.encrypted_api_key);
    } catch {
      return new NextResponse("Failed to decrypt API key", { status: 500 });
    }

    const targetUrl = `${panel.panel_url}/api/client/servers/${identifier}/${path}`;
    
    const wsUrl = targetUrl.replace("http://", "ws://").replace("https://", "wss://");
    
    return new NextResponse("WebSocket proxy requires client-side connection", { status: 501 });
  } catch (error) {
    console.error("WebSocket proxy error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
