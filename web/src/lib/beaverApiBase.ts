const FALLBACK_API_BASE =
  "https://7z5hasjmgbucekg25xnkjirhum0qqwea.lambda-url.us-east-2.on.aws/";

export function resolveBeaverApiBase() {
  const fromEnv =
    process.env.BEAVER_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BEAVER_API_BASE_URL ||
    process.env.AMPLIFY_BEAVER_API_BASE_URL;

  return {
    value: fromEnv || FALLBACK_API_BASE,
    source: fromEnv ? "env" : "fallback",
  };
}
