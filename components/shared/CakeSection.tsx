import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Cakes() {
  return (
    <section className="relative rounded-sm overflow-hidden bg-blue-600">
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-8 text-center">
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-200 mb-6 lg:mb-4">
            Every Celebration
         <br/> Deserves a Cake 
          </h2>
          <Link href="/bakery">
          <Button
          
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-2 px-6 rounded-full transition-colors duration-300">
            Place your order today {String.fromCodePoint(0x1f973)}
            </Button>
          </Link>
        </div>

        <div className="relative mt-10 lg:mt-8">
          <div className="absolute inset-0 bg-white rounded-full transform -skew-y-6 scale-110 origin-bottom-left shadow-lg"></div>
          <div className="relative z-10 flex justify-center items-end space-x-6">
            <Image
              src="/cake9.avif?height=300&width=300"
              alt="Chocolate cake with strawberries"
              width={250}
              height={250}
              className="w-1/4 h-auto object-contain rounded-sm"
            />
            <Image
              src="/cake4.webp?height=400&width=300"
              alt="Decorated multi-tier cake"
              width={250}
              height={350}
              className="w-1/4 h-auto object-contain rounded-sm"
            />
            <Image
              src="/cake0.avif?height=150&width=150"
              alt="Tiger cake topper"
              width={200}
              height={200}
              className="w-1/4 h-auto object-contain rounded-sm"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0"></div>
    </section>
  );
}
