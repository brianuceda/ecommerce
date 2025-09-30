interface Environment {
  BACKEND_URL: string;
  NODE_ENV: string;
}

export const env: Environment = {
  NODE_ENV: process.env.NODE_ENV || "development",
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
};
