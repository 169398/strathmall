import { GlareCard } from "../ui/glare-card";

export function UserGlareCard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <GlareCard className="flex flex-col items-center justify-center col-span-1 min-h-[300px]">
        <h2 className="text-2xl font-bold text-white">Step 1</h2>
        <p className="mt-4 text-base text-slate-900">
          A customer finds your product and places an order through StrathMall
        </p>
      </GlareCard>
      <GlareCard className="flex flex-col items-center justify-center col-span-1 min-h-[300px]">
        <h2 className="text-2xl font-bold text-white">Step 1</h2>
        <p className="mt-4 text-base text-slate-900">
          A customer finds your product and places an order through StrathMall
        </p>
      </GlareCard>
      <GlareCard className="flex flex-col items-center justify-center col-span-1 min-h-[300px]">
        <h2 className="text-2xl font-bold text-white">Step 1</h2>
        <p className="mt-4 text-base text-slate-900">
          A customer finds your product and places an order through StrathMall
        </p>
      </GlareCard>
    </div>
  );
}
