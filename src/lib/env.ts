export const env = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://www.teao-damper.com",
  API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  API_KEY: process.env.API_KEY || "",

  LINKEDIN_URL: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
  YOUTUBE_URL: process.env.NEXT_PUBLIC_YOUTUBE_URL || "#",
  FACEBOOK_URL: process.env.NEXT_PUBLIC_FACEBOOK_URL || "#",
  ALIBABA_URL: process.env.NEXT_PUBLIC_ALIBABA_URL || "#",

  YOUTUBE_VIDEO_ID: process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || "",
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION || "",
  PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
} as const;
