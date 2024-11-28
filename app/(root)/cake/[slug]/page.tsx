import CakeClient from "../cake-client";

interface CakePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CakePage({ params }: CakePageProps) {
  const { slug } = await params;
  return <CakeClient slug={slug} />;
}
