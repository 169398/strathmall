import { getAllServices } from "@/lib/actions/sellerproduct.actions";
import ServicesSection from "@/components/shared/ServicesSection";

export default async function ServicesPage() {
  const servicesData = await getAllServices();

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-white to-blue-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            Professional Services Marketplace 🌟
          </h1>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Connect with trusted service providers from your university community
          </p>
        </div>
      </div>
      <ServicesSection data={{
        success: servicesData.success,
        data: servicesData.data?.map(item => ({
          ...item,
          services: item.services || null
        })) || []
      }} />
    </div>
  );
}