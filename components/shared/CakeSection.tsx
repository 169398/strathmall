import Image from "next/image";
import { Button } from "@/components/ui/button";
import SplitText from "../ui/split-text";

export default function Cakes() {
  return (
    <section className="relative rounded-sm overflow-hidden bg-blue-600">
      <div className="container  mx-auto px-4 py-12 sm:py-16 lg:py-8">
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 lg:mb-4 ">
                      <SplitText text="Every celebration " />
                        <SplitText text="deserves a cake" />
          </h2>
          <Button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300">
            Place your order today
          </Button>
        </div>
        <div className="relative mt-10 lg:mt-8">
          <div className="absolute inset-0 bg-white rounded-full transform -skew-y-6 scale-110 origin-bottom-left"></div>
          <div className="relative z-10 flex justify-end items-end space-x-4">
            <Image
              src="/cake9.avif?height=300&width=300"
              alt="Chocolate cake with strawberries"
              width={300}
              height={300}
              className="w-1/3 h-auto object-contain"
            />
            <Image
              src="/cake4.webp?height=400&width=300"
              alt="Decorated multi-tier cake"
              width={300}
              height={400}
              className="w-1/3 h-auto object-contain"
            />
            <Image
              src="/cake0.avif?height=150&width=150"
              alt="Tiger cake topper"
              width={150}
              height={150}
              className="w-1/4 h-auto object-contain"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0"></div>
    </section>
  );
}
