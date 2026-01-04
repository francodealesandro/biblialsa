<script>
import { onMount } from 'svelte';
import books from '../data/books.json';

// Exported props
export let onChapterSelect = null;
export let autoAdvance = true;

// State
let showMenu = false;
let dark = false;
const logo = '/biblialsa.svg';

// --- UI Actions ---
function toggleMenu() {
  showMenu = !showMenu;
}

function toggleDark() {
  dark = !dark;
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('biblialsa-dark', dark ? '1' : '0');
}

// --- Lifecycle ---
onMount(() => {
  // Init dark mode
  dark = localStorage.getItem('biblialsa-dark') === '1';
  document.documentElement.classList.toggle('dark', dark);
  // Init autoAdvance (default true)
  const stored = localStorage.getItem('biblialsa-autoAdvance');
  autoAdvance = stored === null ? true : stored === '1';
});
</script>

<header>
  <div class="header-content">
    <button aria-label="Alternar modo oscuro" on:click={toggleDark}>
      {#if dark}🌙{:else}☀️{/if}
    </button>
    <h1>Biblia LSA</h1>
    <button class="bible-menu-btn" aria-label="Mostrar menú de libros" on:click={toggleMenu}>
      {#if showMenu}📖{:else}📕{/if}
    </button>
    {#if showMenu}
  <div class="bible-dropdown" on:blur={() => showMenu = false}>
        <ul>
          {#each books as book}
            <li>
              <span class="book-title">{book.name}</span>
              <ul>
                {#each book.chapters as chapter}
                  <li class="chapter-item">
                    <button on:click={() => { showMenu = false; onChapterSelect && onChapterSelect(book, chapter); }}>
                      {chapter.chapter}
                    </button>
                  </li>
                {/each}
              </ul>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</header>
<slot />

<style>
/* --- Header & Layout --- */
:root {
  --primary: rgb(221, 69, 51);
  --primary-dark: rgb(221, 69, 51);
  --surface: #181818;
  --border-radius: 12px;
  --shadow: 0 0 16px #0006;
}
header {
  background: var(--header-bg, #1976d2);
  color: #fff;
  padding: 0;
}
.header-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 480px;
  margin: 0 auto;
  padding: 0.5rem 1rem;
}
h1 {
  flex: 1;
  text-align: center;
  font-size: 1.5rem;
  margin: 0;
}

/* --- Botón menú --- */
.bible-menu-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.7rem;
  margin-right: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* --- Dropdown --- */
.bible-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #222;
  color: #fff;
  border-radius: 0 0 10px 10px;
  box-shadow: 2px 4px 24px #0007;
  padding: 1rem 1.2rem;
  z-index: 100;
  min-width: 220px;
  max-height: 60vh;
  overflow-y: auto;
}
.bible-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.bible-dropdown .book-title {
  font-weight: bold;
  margin-top: 0.7em;
  display: block;
  color: #fff;
}
.bible-dropdown .chapter-item {
  display: inline-block;
  margin-left: 0.3em;
  margin-right: 0.3em;
  color: #fff;
  font-size: 0.98em;
  margin-bottom: 0.2em;
}
.bible-dropdown .chapter-item button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  padding: 0.2em 0.7em;
  border-radius: 6px;
  transition: background 0.2s;
}
.bible-dropdown .chapter-item button:hover,
.bible-dropdown .chapter-item button:focus {
  background: var(--primary);
  color: #fff;
}

/* --- General Buttons --- */
button {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
}

/* --- Dark mode --- */
:global(.dark) {
  --header-bg: #222;
  background: #181818;
  color: #fff;
}
</style>
