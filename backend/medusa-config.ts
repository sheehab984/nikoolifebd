import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  plugins: [
    {
      resolve: "@medusajs/payment-stripe",
      options: {
        apiKey: process.env.STRIPE_API_KEY,
        // PayPal is enabled via Stripe dashboard → Payment methods → PayPal
      },
    },
  ],
  modules: [
    {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              // Files stored in `uploads/` in the server working dir.
              // Served by nginx directly from the uploads_data Docker volume at
              //   https://api.nikoolife.co.uk/uploads/{filename}
              // FILE_UPLOAD_URL must include the /uploads path so generated
              // image URLs resolve correctly (e.g. https://api.nikoolife.co.uk/uploads).
              upload_dir: "uploads",
              backend_url: process.env.FILE_UPLOAD_URL || "http://localhost:9000/uploads",
            },
          },
        ],
      },
    },
    ...(process.env.RESEND_API_KEY ? [
      {
        resolve: "@medusajs/notification",
        options: {
          providers: [
            {
              resolve: "./src/modules/resend-notification",
              id: "resend",
              options: {
                channels: ["email"],
                api_key: process.env.RESEND_API_KEY,
                from: process.env.RESEND_FROM_EMAIL || "Nikoo Life <hello@nikoolife.co.uk>",
              },
            },
          ],
        },
      },
    ] : []),
  ],
})
