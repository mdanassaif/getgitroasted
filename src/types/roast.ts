export interface RoastData {
  story: string[];
  repo: {
    name: string;
    description: string | null;
    language: string;
    languages?: string[];
    stars: number;
    lastUpdate: string;
    forks: number;
    watchers: number;
    firstCommit?: string;
    commitFrequency?: string;
  };
  gif: string;
}