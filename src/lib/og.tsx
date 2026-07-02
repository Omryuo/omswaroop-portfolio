import fs from "node:fs";
import path from "node:path";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = path.join(process.cwd(), "src/og-fonts");
const regular = fs.readFileSync(path.join(fontDir, "DejaVuSans.ttf"));
const bold = fs.readFileSync(path.join(fontDir, "DejaVuSans-Bold.ttf"));

export const ogFonts = [
  { name: "Sans", data: regular, weight: 400 as const, style: "normal" as const },
  { name: "Sans", data: bold, weight: 700 as const, style: "normal" as const },
];

export function OgCard({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#070708",
        backgroundImage:
          "radial-gradient(900px circle at 95% 0%, rgba(255,35,66,0.22), transparent 55%), radial-gradient(900px circle at 0% 110%, rgba(155,77,255,0.20), transparent 55%)",
        padding: 72,
        fontFamily: "Sans",
        color: "#f4f4f6",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#ff5a72",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 22,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>Omswaroop T M</div>
          <div style={{ display: "flex", fontSize: 20, color: "#9a9aa6", marginTop: 6 }}>
            B.Tech CSE · KPMG Cyber MDR · IEEE-published
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: 150,
            height: 8,
            borderRadius: 4,
            backgroundImage: "linear-gradient(90deg, #ff2342, #9b4dff)",
          }}
        />
      </div>
    </div>
  );
}
