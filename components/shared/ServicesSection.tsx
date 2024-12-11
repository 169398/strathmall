import ServiceCard from "./ServiceCard";

interface ServicesSectionProps {
  data: {
    success: boolean;
    data: Array<{
      id: string;
      shopName: string;
      sellerName: string;
      phoneNumber: string;
      services: Array<{
        name: string;
        description: string;
        price: number | null;
        hasCustomPrice: boolean;
        images: string[];
      }> | null;
    }>;
  };
}

const ServicesSection = ({ data }: ServicesSectionProps) => {
  if (!data?.success || !data?.data?.length) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
       
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.data.map((seller) => 
            seller.services?.map((service, index) => (
              <ServiceCard 
                key={`${seller.id}-${index}`}
                shopName={seller.shopName}
                sellerName={seller.sellerName}
                phoneNumber={seller.phoneNumber}
                service={service}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 