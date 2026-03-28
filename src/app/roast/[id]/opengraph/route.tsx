import { ImageResponse } from "@takumi-rs/image-response";
import { api } from "@/trpc/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export const runtime = "nodejs";

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;

  let roast;
  try {
    roast = await api.roast.getById({ id });
  } catch {
    return new Response("Not Found", { status: 404 });
  }

  if (!roast) {
    return new Response("Not Found", { status: 404 });
  }

  const { analysis, language } = roast;
  const score = analysis.shameScore;
  const scoreStr = score.toFixed(1);
  const loc = analysis.loc || 0;

  const verdictColor =
    score < 5 ? "#EF4444" : score < 8 ? "#F59E0B" : "#10B981";
  const verdictText = analysis.cruelPhrase.toLowerCase();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        padding: 64,
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 28,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            color: "#10B981",
            fontSize: 24,
            fontFamily: "JetBrains Mono",
            fontWeight: 700,
          }}
        >
          &gt;
        </span>
        <span
          style={{
            color: "#E5E5E5",
            fontSize: 20,
            fontFamily: "JetBrains Mono",
            fontWeight: 500,
          }}
        >
          devroast
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
        }}
      >
        <span
          style={{
            color: "#F59E0B",
            fontSize: 160,
            fontFamily: "JetBrains Mono",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {scoreStr}
        </span>
        <span
          style={{
            color: "#737373",
            fontSize: 56,
            fontFamily: "JetBrains Mono",
          }}
        >
          /10
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: verdictColor,
          }}
        />
        <span
          style={{
            color: verdictColor,
            fontSize: 20,
            fontFamily: "JetBrains Mono",
          }}
        >
          {verdictText}
        </span>
      </div>

      <span
        style={{
          color: "#737373",
          fontSize: 16,
          fontFamily: "JetBrains Mono",
        }}
      >
        {language} · {loc} lines
      </span>

      <span
        style={{
          color: "#E5E5E5",
          fontSize: 22,
          fontFamily: "IBM Plex Mono",
          textAlign: "center",
          maxWidth: "100%",
        }}
      >
        "{analysis.sarcasticPhrase}"
      </span>
    </div>,
    {
      width: 1200,
      height: 630,
      format: "png",
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
