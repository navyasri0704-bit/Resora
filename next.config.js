/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'illustrations.pouch.dev', 'ui-avatars.com'],
  },
  async redirects() {
    return [
      {
        source: '/student/smart-finder',
        destination: '/student/resources',
        permanent: true,
      },
      {
        source: '/student/hackathons',
        destination: '/student/opportunities',
        permanent: true,
      },
      {
        source: '/student/internships',
        destination: '/student/opportunities',
        permanent: true,
      },
      {
        source: '/student/campus-map',
        destination: '/student/resources',
        permanent: true,
      },
      {
        source: '/check-in',
        destination: '/student/dashboard',
        permanent: true,
      },
      {
        source: '/student/placements',
        destination: '/student/preparation?tab=placement',
        permanent: true,
      },
      {
        source: '/student/exam-preparation',
        destination: '/student/preparation?tab=exam',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
