import QuickViewClient from "../quickview-client";

export default async function QuickViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <QuickViewClient slug={slug} />;
}
