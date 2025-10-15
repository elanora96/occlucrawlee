import { CheerioCrawler } from "crawlee";

import { router } from "./routes.js";

const BASE_URL = "https://www.horg.com";
const HORG_IDENTIFCATION_GUIDE = `${BASE_URL}/horg/?page_id=3281`;

const crawler = new CheerioCrawler({
  requestHandler: router,
  maxRequestsPerCrawl: 20, // Comment this option to scrape the full website.
});

await crawler.run([HORG_IDENTIFCATION_GUIDE]);
