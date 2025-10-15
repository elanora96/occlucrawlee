import type { Cheerio } from "cheerio";
import type { Element } from "domhandler";
import type {
  GeographicalClassification,
  OcclupanidEntry,
  TaxonomicRank,
} from "horg";

export class Occlupanid implements OcclupanidEntry {
  name: string;
  canonicalUrl: string;
  id: number;
  imageUrl?: string;
  geographicalClassification: GeographicalClassification;
  sciname: string;
  taxonomicRank: TaxonomicRank;
  externalMorphology: string;
  description: string;

  private getIdFromUrl = (url: string): number => {
    const params = new URL(url).searchParams;
    return Number(params.get("page_id"));
  };

  constructor(entry: Cheerio<Element>, url: string) {
    this.name = entry.find("title").text();
    this.canonicalUrl = url;
    this.id = this.getIdFromUrl(url);
    this.imageUrl = entry.find(".card-content img").attr("src");
    this.geographicalClassification = geographicalClassification;
    this.sciname = entry.find(".sciname").text();
    this.taxonomicRank = taxonomicRank;
    this.externalMorphology = externalMorphology;
    this.description = entry.find(".description  p").text();
  }
}
