import { writable } from 'svelte/store';

// video: { videoId, bookId, chapterId, verses }
export const currentVideo = writable(null);