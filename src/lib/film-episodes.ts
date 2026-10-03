export const FILM_EPISODES = [
  { episodeNumber: 1, title: 'Inside the Machine' },
  { episodeNumber: 2, title: 'The Dissolution of Churches' },
  { episodeNumber: 3, title: 'Do Nothing' },
] as const;

export function displayEpisodeTitle(episodeNumber: number, fallback?: string | null) {
  return FILM_EPISODES.find((episode) => episode.episodeNumber === episodeNumber)?.title ?? fallback ?? '';
}
