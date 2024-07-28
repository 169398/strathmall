import { HoverEffect } from "../ui/card-hover-effect";

export function CardHover() {
  return (
    <div className=" mx-auto px-8   ">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "Increase your visibility",
    description:
      "Strathmall  strategically operates in a prime area, ensuring high online traffic and exposure to a diverse customer base. By establishing your business here, you can significantly increase your brand visibility and reach a wider audience..",
  },
  {
    title: "Build Lasting Relationships",
    description:
      " Connect with your customers on a deeper level through our loyalty programs and data insights. Understand their preferences, gather feedback, and foster long-term loyalty. Strathmall empowers you to build meaningful relationships with your customers, turning them into loyal advocates for your brand..",
  },
  {
    title: "Amplify Your Reach",
    description:
      "Stand out from the crowd with our integrated marketing strategies. From targeted in-mall promotions to engaging social media campaigns, we'll help you reach a wider audience and attract more customers to your doorstep. Increase your visibility and drive footfall like never before.",
  },
];
