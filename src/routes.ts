import { createCheerioRouter, Dataset } from "crawlee";
import { OcclupanidEntry } from "./types/index.js";

export const router = createCheerioRouter();

// Default Handler applied to every request without a label
router.addDefaultHandler(async ({ enqueueLinks, log, request }) => {
  log.info(`Scraping ${request.url}`);

  await enqueueLinks({
    selector: "div.description div[id^=attachment] a",
    label: "FAMILY",
  });
});

// Handler applied only to requests with the "FAMILY" label
router.addHandler("FAMILY", async ({ enqueueLinks, log, request }) => {
  log.info(`Scraping ${request.url}`);

  await enqueueLinks({
    selector: "dl.gallery-item a",
    label: "SPECIES",
  });
});

// Handler applied only to requests with the "SPECIES" label
router.addHandler("SPECIES", async ({ log, $, request: { url } }) => {
  log.info(`Scraping ${url}`);

  const $entry = $(".entry");

  const breadClip = new OcclupanidEntry($entry, url, $);

  // Push data to Crawlee's dataset
  await Dataset.pushData(breadClip);
});
