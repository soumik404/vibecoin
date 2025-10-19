const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
   "accountAssociation": {
    "header": "eyJmaWQiOjkzMjEwNywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDc4MUY0Q0E2ZTlhMjcyODU5YWY1QzMxRDAzNmU3NjY1MDlmRTA1NzkifQ",
    "payload": "eyJkb21haW4iOiJ2aWJlY29pbi1wc2kudmVyY2VsLmFwcCJ9",
    "signature": "vWsW7iUPvzDpSXLHzU3/ijpFF54HZRaR9uu3qUHo0Vp5kesdITBOCno0BjlVW5T2k5OLHQZjeQBhuBobOJbkQRs="
  },
  miniapp: {
    version: "1",
    name: "VibeCoin", 
    subtitle: "Check Your Base Knowledge", 
    description: "Quiz",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.jpg`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    buttonTitle: "Check Your Base Vibes",
    tags: ["nft", "quiz", "mint", "base", "onchain"],
    heroImageUrl: `${ROOT_URL}/share-image.png`, 
    tagline: "Your Onchain Vibe Starts Here",
    ogTitle: "VibeCoin, Mint Your Base Vibes",
    ogDescription: "Base Mini App where you can mint NFTs, test your Base knowledge, and show your onchain vibes.",
    ogImageUrl: `${ROOT_URL}/share-image.png`,
    "noindex": false
  },
  "baseBuilder": {
    "ownerAddress": "0xc775185C61448F85B2530cc96Ff1297C45AfbF48"
  }
} as const;

