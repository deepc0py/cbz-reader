<script lang="ts">
  import { extractCBZ, revokePages, type MangaPage } from './lib/cbz';
  import DropZone from './lib/DropZone.svelte';
  import Reader from './lib/Reader.svelte';

  let pages: MangaPage[] = $state([]);
  let loading = $state(false);
  let loadProgress = $state({ loaded: 0, total: 0 });
  let fileName = $state('');

  async function handleFile(file: File) {
    loading = true;
    fileName = file.name.replace(/\.cbz$/i, '');

    try {
      pages = await extractCBZ(file, (loaded, total) => {
        loadProgress = { loaded, total };
      });
    } catch (err) {
      throw new Error(`Failed to extract CBZ: ${err}`);
    } finally {
      loading = false;
    }
  }

  function handleClose() {
    revokePages(pages);
    pages = [];
    fileName = '';
  }
</script>

{#if pages.length > 0}
  <Reader {pages} title={fileName} onClose={handleClose} />
{:else if loading}
  <div class="loading">
    <div class="loading-inner">
      <div class="spinner"></div>
      <p class="loading-title">Extracting {fileName}</p>
      <div class="progress-bar">
        <div
          class="progress-fill"
          style="width: {loadProgress.total ? (loadProgress.loaded / loadProgress.total) * 100 : 0}%"
        ></div>
      </div>
      <p class="loading-count">{loadProgress.loaded} / {loadProgress.total} pages</p>
    </div>
  </div>
{:else}
  <DropZone onFile={handleFile} />
{/if}

<style>
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .loading-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-title {
    font-size: 18px;
    font-weight: 500;
  }

  .progress-bar {
    width: 280px;
    height: 4px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 2px;
    transition: width 0.1s ease-out;
  }

  .loading-count {
    font-size: 13px;
    color: var(--text-dim);
  }
</style>
