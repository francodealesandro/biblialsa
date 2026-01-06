

<script>
import { onMount } from 'svelte';
import UI from './lib/UI.svelte';
import { currentVideo } from './lib/videoStore.js';
import books from './data/books.json';

// --- State ---
let autoplay = true;
let autoAdvance = true;
let video = null;
let selectedBook = books[0];
let selectedChapter = books[0]?.chapters[0];

$: $currentVideo, video = $currentVideo;

// --- Lifecycle ---
onMount(() => {
  if (selectedBook && selectedChapter && selectedChapter.videos && selectedChapter.videos[0]) {
    currentVideo.set({
      videoId: selectedChapter.videos[0].videoId,
      bookId: selectedBook.id,
      chapterId: selectedChapter.chapter,
      verses: selectedChapter.videos[0].verses
    });
  }
});

// --- UI Actions ---
function handleChapterSelect(book, chapter) {
  selectedBook = book;
  selectedChapter = chapter;
  // Selecciona el primer versículo del capítulo
  if (chapter.videos && chapter.videos[0]) {
    currentVideo.set({
      videoId: chapter.videos[0].videoId,
      bookId: book.id,
      chapterId: chapter.chapter,
      verses: chapter.videos[0].verses
    });
  }
}

  // --- Auto-Avance: ir al próximo versículo al terminar el video ---
  let lastVideoId = null;

  /**
   * Llama cuando el iframe de YouTube se carga para escuchar el fin del video.
   */
  function onIframeLoad(event) {
    const iframe = event.target;
    if (!iframe || !video) return;
    // Limpia listeners previos
    if (iframe._ytListener) {
      window.removeEventListener('message', iframe._ytListener);
    }
    iframe._ytListener = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.event === 'onStateChange' && e.data.info === 0) { // 0 = ended
        handleVideoEnd();
      }
    };
    window.addEventListener('message', iframe._ytListener);
    lastVideoId = video?.videoId;
  }

  /**
   * Si autoAdvance está activo, selecciona el próximo versículo automáticamente.
   */
  function handleVideoEnd() {
    if (!autoAdvance) return;
    const chapter = selectedChapter;
    if (!chapter || !chapter.videos) return;
    const idx = chapter.videos.findIndex(v => v.videoId === video?.videoId);
    if (idx !== -1 && idx < chapter.videos.length - 1) {
      // Siguiente versículo en el mismo capítulo
      const next = chapter.videos[idx + 1];
      currentVideo.set({
        videoId: next.videoId,
        bookId: selectedBook.id,
        chapterId: chapter.chapter,
        verses: next.verses
      });
    }
    // Si es el último, no hace nada (puedes agregar lógica para avanzar de capítulo si lo deseas)
  }
</script>

<UI onChapterSelect={handleChapterSelect} bind:autoAdvance>
  <main>
    <div class="global-video-container" aria-label="Video en LSA">
      <iframe
        title={video ? `Capítulo ${video?.chapterId || ''} Versículos ${video.verses} en LSA` : 'Video en LSA'}
        src={video ? `https://www.youtube.com/embed/${video.videoId}?autoplay=${autoplay ? 1 : 0}` : ''}
        frameborder="0"
        allowfullscreen
        on:load={onIframeLoad}
      ></iframe>
    </div>

    <div class="autoplay-toggle">
      <label class="switch">
        <input type="checkbox" bind:checked={autoplay} />
        <span class="slider"></span>
      </label>
      <span class="autoplay-label">Autoplay</span>
      <!-- <label class="switch" style="margin-left:1.2em;">
        <input type="checkbox" bind:checked={autoAdvance} />
        <span class="slider"></span>
      </label>
      <span class="autoplay-label">Auto-Avance</span> -->
    </div>
    <section aria-label="Listado de libros y capítulos">
        <div class="book-block">
          <h2>{selectedBook.name} {selectedChapter.chapter}</h2>
          <div class="chapter-stack">
            <div class="chapter-block">
              <ul class="videos-list">
                {#each selectedChapter.videos as video}
                  <li>
                    <button
                      class:selected={
                        $currentVideo &&
                        $currentVideo.videoId === video.videoId &&
                        $currentVideo.bookId === selectedBook.id &&
                        $currentVideo.chapterId === selectedChapter.chapter
                      }
                      on:click={() => currentVideo.set({
                        videoId: video.videoId,
                        bookId: selectedBook.id,
                        chapterId: selectedChapter.chapter,
                        verses: video.verses
                      })}
                    >
                      {video.verses}
                    </button>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
    </section>
  </main>
</UI>

<style>
  /* --- General --- */
  h2 {
    color: #222;
  }
  main {
    --primary: rgb(221, 69, 51);
    --primary-dark: rgb(221, 69, 51);
    --surface: #181818;
    --border-radius: 12px;
    --shadow: 0 0 16px #0006;
    box-shadow: 0 0 16px #0001;
    border-radius: 12px;
    padding-bottom: 2rem;
  }

  /* --- Video --- */
  .global-video-container {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--surface);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    margin: 1.5rem auto 2rem auto;
    width: 100%;
    height: 100%;
    min-height: 200px;
    aspect-ratio: 16/9;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
  }
  .global-video-container iframe {
    width: 100%;
    height: 100%;
    min-height: 200px;
    aspect-ratio: 16/9;
    border-radius: var(--border-radius);
    background: #000 !important;
    color-scheme: dark;
    display: block;
  }

  /* --- Book/Chapter Blocks --- */
  .book-block {
    margin-bottom: 2.5rem;
    background: #fff;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    padding: 1rem 1.5rem;
    color: #222;
  }
  .chapter-block {
    /* ...existing styles... */
    color: #222;
  }
  :global(.dark) .book-block,
  :global(.dark) .chapter-block {
    background: var(--surface);
    color: #fff;
  }
  .book-block h2 {
    margin-bottom: 1rem;
    font-size: 1.4rem;
  }
  :global(.dark) .book-block h2 {
    color: #fff !important;
  }
  .chapter-stack {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    overflow-x: auto;
    padding-bottom: 1rem;
  }
  .chapter-block {
    min-width: 220px;
    background: #fff;
    border-radius: var(--border-radius);
    /* box-shadow removed for flat look */
    padding: 1rem;
    margin-bottom: 1.5rem;
    color: #222;
  }
  :global(.dark) .chapter-block {
    background: var(--surface);
    color: #fff;
  }
  /* .chapter-block h3 removed (unused) */

  /* --- Verses List --- */
  .videos-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.7rem;
  }
  .videos-list li {
    margin: 0;
  }
  .videos-list button {
    background: transparent;
    border: none;
    color: #222;
    border-radius: var(--border-radius);
    padding: 0.3em 0.9em;
    font-size: 1em;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    font-weight: bold;
  }
  .videos-list button.selected {
    background: var(--primary);
    color: #fff;
  }
  .videos-list button:hover,
  .videos-list button:focus {
    background: var(--primary);
    color: #fff;
    outline: none;
  }
  :global(.dark) h2 {
    color: #fff !important;
  }
  :global(.dark) .videos-list button {
    color: #fff;
  }

  /* --- Toggles --- */
  .autoplay-toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    color: #222;
    gap: 0.7rem;
  }
  :global(.dark) .autoplay-toggle {
    color: #fff;
  }
  .autoplay-label {
    margin-left: 0.5em;
    font-weight: bold;
    letter-spacing: 0.5px;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #444;
    border-radius: 24px;
    transition: background 0.2s;
  }
  .switch input:checked + .slider {
    background: var(--primary);
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.2s;
  }
  .switch input:checked + .slider:before {
    transform: translateX(20px);
  }
</style>
