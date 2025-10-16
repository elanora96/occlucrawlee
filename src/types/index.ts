import type { Cheerio, CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import type {
  GeographicalClassification,
  Occlupanid,
  ParsedSpeciesDataList,
  TaxonomicRank,
} from "horg";

export class Entry {
  protected getIdFromUrl = (url: string): number => {
    const params = new URL(url).searchParams;
    return Number(params.get("page_id"));
  };

  protected parseDataList = (dataList: Cheerio<Element>, $: CheerioAPI) => {
    const parsed = dataList
      .find("dt")
      .map((_, element) => {
        return {
          key: $(element).text() as string,
          value: $(element).next().text(),
        };
      })
      .toArray()
      .reduce((obj: { [key: string]: string }, item) => {
        obj[item.key] = item.value;
        return obj;
      }, {});

    return parsed;
  };
}

export class OcclupanidEntry extends Entry implements Occlupanid {
  name: string;
  canonicalUrl: string;
  id: number;
  imageUrl?: string;
  geographicalClassification: GeographicalClassification;
  sciname: string;
  taxonomicRank: TaxonomicRank;
  externalMorphology: string;
  description: string;

  protected constructGeographicalClassification = (
    entry: Cheerio<Element>,
  ): GeographicalClassification => {};

  protected parseSpeciesDataList = (
    dataList: Cheerio<Element>,
    $: CheerioAPI,
  ): ParsedSpeciesDataList => {
    const {
      kingdom,
      phylum,
      class: classVar, // class is a reserved word in JS
      order,
      family,
      genus,
      species,
      externalMorphology,
    } = this.parseDataList(dataList, $);

    return {
      externalMorphology,
      taxonomicRank: {
        kingdom,
        phylum,
        class: classVar,
        order,
        family,
        genus,
        species,
      },
    };
  };

  constructor(entry: Cheerio<Element>, url: string, $: CheerioAPI) {
    // Construct everything from Entry
    super();

    // Simple Enough Cheerio CSS Queries
    this.name = entry.find("title").text();
    this.imageUrl = entry.find(".card-content img").attr("src");
    this.sciname = entry.find(".sciname").text();
    this.description = entry.find(".description  p").text();

    // Url usage
    this.canonicalUrl = url;
    this.id = this.getIdFromUrl(url);

    // More complex function calls
    this.geographicalClassification =
      this.constructGeographicalClassification(entry);

    // The taxonomicRank and externalMorphology come from the same <dl>
    const { taxonomicRank, externalMorphology } = this.parseSpeciesDataList(
      entry.find(".card-content > dl"),
      $,
    );
    this.taxonomicRank = taxonomicRank;
    this.externalMorphology = externalMorphology;
  }
}
