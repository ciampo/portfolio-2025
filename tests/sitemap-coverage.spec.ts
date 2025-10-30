import { test, expect } from "@playwright/test";

/**
 * Sitemap coverage test
 *
 * - Fetches the remote sitemap (default: https://marcociampini.io/sitemap.xml)
 * - Extracts all <loc> URLs
 * - For each URL, requests the same path on the local site (default: http://localhost:3000)
 * - Fails the test if any local path returns a non-2xx status
 *
 * Environment variables:
 * - REMOTE_SITEMAP: remote sitemap URL (default: https://marcociampini.io/sitemap.xml)
 * - LOCAL_BASE_URL: base URL of the local site under test (default: http://localhost:3000)
 *
 * Usage:
 *   LOCAL_BASE_URL=http://localhost:3000 npx playwright test tests/sitemap-coverage.spec.ts
 */

const DEFAULT_SITEMAP = "https://marcociampini.io/sitemap.xml";

function extractLocsFromSitemap(xml: string): string[] {
  // Simple XML extraction that finds <loc>...</loc> occurrences.
  // This avoids adding a dependency for XML parsing but is robust enough for typical sitemaps.
  const matches = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/gi));
  return matches.map((m) => m[1].trim());
}

test("local site covers remote sitemap URLs", async ({ request }) => {
  const sitemapUrl = process.env.REMOTE_SITEMAP ?? DEFAULT_SITEMAP;

  const sitemapResp = await fetch(sitemapUrl);
  expect(
    sitemapResp.ok,
    `Failed to fetch remote sitemap at ${sitemapUrl}`
  ).toBeTruthy();
  const sitemapXml = await sitemapResp.text();

  const locs = extractLocsFromSitemap(sitemapXml);
  expect(locs.length).toBeGreaterThan(0);

  const failures: { url: string; status: number }[] = [];

  for (const loc of locs) {
    // Convert remote URL to a path and test the same path on the local base.
    let path: string;
    try {
      const u = new URL(loc);
      path = u.pathname + u.search;
    } catch (err) {
      // If loc is not a full URL, use it as-is (fallback)
      path = loc;
    }

    // Use Playwright's request fixture for a fast HTTP check without loading pages.
    const res = await request.get(path, { timeout: 10000 });

    if (res.status() >= 400) {
      failures.push({ url: path, status: res.status() });
    }
  }

  if (failures.length > 0) {
    const lines = failures.map((f) => `${f.status} ${f.url}`).join("\n");
    // Fail with a helpful message
    expect(
      failures,
      `Missing or failing local pages for the following sitemap entries:\n${lines}`
    ).toHaveLength(0);
  }
});
