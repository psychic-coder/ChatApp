const corsOption= {
    origin: ["http://localhost:5174","http://localhost:4173",process.env.CLIENT_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials: true,
  }


  export const ACCESS_TOKEN="access_token"

  export {corsOption};