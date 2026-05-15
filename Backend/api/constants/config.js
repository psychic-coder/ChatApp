const corsOption = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL ? process.env.CLIENT_URL.trim() : undefined,
  ].filter(Boolean),
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};


  export const ACCESS_TOKEN="access_token"

  export {corsOption};