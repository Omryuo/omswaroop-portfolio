import { ImageResponse } from "next/og";
import { OgCard, ogSize, ogContentType, ogFonts } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Omswaroop T M — Cyber MDR Analyst @ KPMG Advisory";

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="Portfolio & Research"
      title="Cyber MDR Analyst @ KPMG Global Services (Advisory)"
    />,
    { ...size, fonts: ogFonts }
  );
}
