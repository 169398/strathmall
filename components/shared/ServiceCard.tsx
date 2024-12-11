"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface ServiceCardProps {
    shopName: string;
    sellerName: string;
    phoneNumber: string;
    service: {
        name: string;
        description: string;
        price: number | null;
        hasCustomPrice: boolean;
        images: string[];
    };
}

const ServiceCard = ({ shopName, sellerName, phoneNumber, service }: ServiceCardProps) => {
    const handleWhatsAppClick = () => {
        const formattedPhone = phoneNumber.replace(/\D/g, '');
        const whatsappNumber = formattedPhone.startsWith('254') 
            ? formattedPhone 
            : `254${formattedPhone.startsWith('0') ? formattedPhone.slice(1) : formattedPhone}`;

        const message = encodeURIComponent(
            `Hi ${sellerName}, I am interested in your service "${service.name}"`
        );
        
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-square relative">
                <Image
                    src={service.images[0] || '/placeholder.png'}
                    alt={service.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{service.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                <div className="mt-2">
                    <p className="text-sm font-medium">Offered by: {shopName}</p>
                    {!service.hasCustomPrice && service.price && (
                        <p className="text-lg font-bold">KES {service.price.toLocaleString()}</p>
                    )}
                    {service.hasCustomPrice && (
                        <p className="text-sm italic">Price on request</p>
                    )}
                </div>
                <Button 
                    onClick={handleWhatsAppClick}
                    className="w-full mt-3 bg-green-500 hover:bg-green-600"
                >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact on WhatsApp
                </Button>
            </div>
        </Card>
    );
};

export default ServiceCard; 