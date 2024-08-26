export default {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000; style-src 'self' 'unsafe-inline';",
            },
          ],
        },
      ];
    },
  };
  