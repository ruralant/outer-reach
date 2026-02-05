import type { APIRoute } from "astro";
import { getNotesForLocale, getNoteGraph } from "../../lib/garden";

export const GET: APIRoute = async () => {
  const allNotes = await getNotesForLocale("en");
  const graph = getNoteGraph(allNotes);

  return new Response(JSON.stringify(graph, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
