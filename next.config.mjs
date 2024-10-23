/** @type {import('next').NextConfig} */
export default {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '5000', // Port ที่คุณใช้ใน local server
          pathname: '/uploads/**',
        },
      ],
    },
  };
