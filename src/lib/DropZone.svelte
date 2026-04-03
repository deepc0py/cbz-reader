<script lang="ts">
  interface Props {
    onFile: (file: File) => void;
  }

  let { onFile }: Props = $props();
  let dragOver = $state(false);
  let fileInput: HTMLInputElement;

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file && /\.cbz$/i.test(file.name)) {
      onFile(file);
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function handleInputChange() {
    const file = fileInput?.files?.[0];
    if (file) onFile(file);
  }

  function handleClick() {
    fileInput?.click();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput?.click();
    }
  }
</script>

<div
  class="dropzone"
  class:dragover={dragOver}
  role="button"
  tabindex="0"
  ondrop={handleDrop}
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  onclick={handleClick}
  onkeydown={handleKeydown}
>
  <input
    bind:this={fileInput}
    type="file"
    accept=".cbz"
    onchange={handleInputChange}
    hidden
  />
  <div class="icon">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M12 6v7" />
      <path d="M9 10l3 3 3-3" />
    </svg>
  </div>
  <p class="title">Drop a CBZ file here</p>
  <p class="subtitle">or click to browse</p>
  <p class="hint">Trackpad swipe &bull; Arrow keys &bull; Click to turn pages</p>
</div>

<style>
  .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 460px;
    max-width: 90vw;
    padding: 60px 40px;
    border: 2px dashed var(--border);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    outline: none;
  }

  .dropzone:hover,
  .dropzone:focus-visible {
    border-color: var(--accent);
    background: rgba(192, 132, 252, 0.03);
  }

  .dropzone.dragover {
    border-color: var(--accent);
    background: rgba(192, 132, 252, 0.08);
    transform: scale(1.02);
  }

  .icon {
    color: var(--text-dim);
    margin-bottom: 4px;
  }

  .title {
    font-size: 20px;
    font-weight: 500;
  }

  .subtitle {
    font-size: 14px;
    color: var(--text-dim);
  }

  .hint {
    font-size: 12px;
    color: var(--text-dim);
    margin-top: 16px;
    opacity: 0.6;
  }
</style>
