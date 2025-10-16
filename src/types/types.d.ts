declare module "horg" {
  export interface GeographicalRegion {
    name: string;
    subregions: string[];
  }

  export interface GeographicalClassification {
    regions: GeographicalRegion[];
  }

  export interface TaxonomicRank {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  }

  export interface ParsedSpeciesDataList {
    taxonomicRank: TaxonomicRank;
    externalMorphology: string;
  }

  export interface Occlupanid {
    name: string;
    canonicalUrl: string;
    id: number;
    imageUrl?: string;
    geographicalClassification: GeographicalClassification;
    sciname: string;
    taxonomicRank: TaxonomicRank;
    externalMorphology: string;
    description: string;
  }
}
