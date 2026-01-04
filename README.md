# Biblia LSA (Lengua de Señas Argentina)

PWA simple y accesible para navegar la Biblia en LSA, pensada para empaquetar como TWA y publicar en Google Play.

## Scripts principales

- `npm install` — Instala dependencias
- `npm run dev` — Corre la app en modo desarrollo
- `npm run build` — Build de producción (output en `/dist`)

## Estructura
- `/src/data/` — Datos mock en JSON (ejemplo: Génesis)
- `/public/manifest.json` — Manifest PWA
- `/public/sw.js` — Service Worker básico

## Bubblewrap (TWA)
1. Build de producción: `npm run build`
2. Usar el contenido de `/dist` como raíz web para Bubblewrap

## Notas
- UI mobile-first, accesible, sin sonidos ni autoplay
- Navegación clara: Libro → Capítulo → Video (YouTube embed)
- No depende de la API de YouTube
- No abre enlaces externos
- Código legible y simple
import { writable } from 'svelte/store'
export default writable(0)
```
