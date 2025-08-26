import { getCollection, type CollectionEntry } from "astro:content";

export function isDevEnv(): boolean {
  return import.meta.env.DEV;
}

export async function getPosts(): Promise<CollectionEntry<"posts">[]> {
  const showDrafts = isDevEnv();
  
  return await getCollection("posts", ({ data }) => {
    return showDrafts || !data.draft;
  });
}

export async function getNotes(): Promise<CollectionEntry<"notes">[]> {
  const showDrafts = isDevEnv();
  
  return await getCollection("notes", ({ data }) => {
    return showDrafts || !data.draft;
  });
}
