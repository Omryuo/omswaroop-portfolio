import { ImageResponse } from "next/og";
import { getPostSlugs, getPostMeta } from "@/lib/blog";
import { OgCard, ogSize, ogContentType, ogFonts } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Blog — Omswaroop T M";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exists = getPostSlugs().includes(slug);
  const meta = exists ? getPostMeta(slug) : null;
  return new ImageResponse(
    <OgCard eyebrow="Blog · Detection & AI Security" title={meta?.title ?? "Blog"} />,
    { ...size, fonts: ogFonts }
  );
}
