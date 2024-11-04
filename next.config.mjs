/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'www.strathmall.com'],
    },
  },
images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
        port: "",
    },
   
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
    },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
        port: "",
      },
    ],
  },

};

export default nextConfig;
