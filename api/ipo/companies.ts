import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const response = await fetch(
      "https://iporesult.cdsc.com.np/result/companyShares/fileUploaded",
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://iporesult.cdsc.com.np/",
          Origin: "https://iporesult.cdsc.com.np",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0 Safari/537.36",
        },
      }
    );

    const text = await response.text();

    res.status(200).send(text);
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
}