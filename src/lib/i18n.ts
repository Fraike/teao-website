export const SUPPORTED_LOCALES = ["ja", "de"] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];

export const LOCALE_LABELS: Record<Locale | "en", string> = {
  en: "English",
  ja: "日本語",
  de: "Deutsch",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  ja: "Japanese",
  de: "German",
};

export const LOCALE_OG: Record<Locale | "en", string> = {
  en: "en_US",
  ja: "ja_JP",
  de: "de_DE",
};

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && SUPPORTED_LOCALES.includes(value as Locale));
}

export function withLocale(path: string, locale?: Locale | "en") {
  if (!locale || locale === "en") return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

export function stripLocale(pathname: string) {
  const [, maybeLocale, ...rest] = pathname.split("/");
  if (isLocale(maybeLocale)) {
    const restPath = rest.join("/");
    return {
      locale: maybeLocale,
      path: restPath ? `/${restPath}` : "/",
    };
  }
  return { locale: "en" as const, path: pathname };
}

export function getLocalizedSlug(slug: string, locale: Locale) {
  return `${slug}-${locale}`;
}

export function getAlternateUrls(path: string) {
  return {
    en: path,
    ja: withLocale(path, "ja"),
    de: withLocale(path, "de"),
    "x-default": path,
  };
}
