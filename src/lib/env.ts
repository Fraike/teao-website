export const env = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://teao-damper.com",
  API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  API_KEY: process.env.API_KEY || "",

  LINKEDIN_URL: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
  YOUTUBE_URL: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@%E5%B0%8F%E5%8F%B2%E5%90%8C%E5%AD%A6",
  FACEBOOK_URL: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/profile.php?id=100039802494362",
  INSTAGRAM_URL: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/luckyboy_mark/",
  X_URL: process.env.NEXT_PUBLIC_X_URL || "https://x.com/WUMBHkKa3rBlr6S",
  ALIBABA_URL: process.env.NEXT_PUBLIC_ALIBABA_URL || "#",

  YOUTUBE_VIDEO_ID: process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || "",
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION || "",
  PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",

  TRANSLATION_PROVIDER: process.env.TRANSLATION_PROVIDER || "openai",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || "",
  TRANSLATION_API_BASE_URL: process.env.TRANSLATION_API_BASE_URL || "",
  TRANSLATION_MODEL: process.env.TRANSLATION_MODEL || "",
  AUTO_TRANSLATE_NEWS: process.env.AUTO_TRANSLATE_NEWS !== "false",
} as const;
