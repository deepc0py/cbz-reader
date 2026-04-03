<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { PageFlip } from 'page-flip';
  import { attachTrackpadGestures } from './gestures';
  import type { MangaPage } from './cbz';

  interface Props {
    pages: MangaPage[];
    title: string;
    onClose: () => void;
  }

  let { pages, title, onClose }: Props = $props();

  let container: HTMLDivElement;
  let pageFlipEl: HTMLDivElement;
  let pageFlip: PageFlip | null = null;
  let currentPage = $state(0);
  let totalPages = $state(0);
  let showUI = $state(true);
  let uiTimeout: ReturnType<typeof setTimeout>;
  let detachGestures: (() => void) | null = null;

  function hideUIAfterDelay() {
    clearTimeout(uiTimeout);
    uiTimeout = setTimeout(() => { showUI = false; }, 3000);
  }

  function flashUI() {
    showUI = true;
    hideUIAfterDelay();
  }

  onMount(() => {
    totalPages = pages.length;

    // Calculate dimensions to fit viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Manga pages are typically ~2:3 ratio
    const pageHeight = vh - 20;
    const pageWidth = Math.floor(pageHeight * (2 / 3));

    pageFlip = new PageFlip(pageFlipEl, {
      width: pageWidth,
      height: pageHeight,
      size: 'stretch',
      maxWidth: Math.floor(vw * 0.45),
      maxHeight: vh - 20,
      minWidth: 300,
      minHeight: 400,
      drawShadow: true,
      flippingTime: 800,
      usePortrait: true,
      startZIndex: 0,
      autoSize: true,
      maxShadowOpacity: 0.4,
      showCover: true,
      mobileScrollSupport: false,
      swipeDistance: 40,
      clickEventForward: true,
      useMouseEvents: true,
      showPageCorners: true,
      startPage: 0,
    });

    const imageUrls = pages.map((p) => p.url);
    pageFlip.loadFromImages(imageUrls);

    pageFlip.on('flip', (e: any) => {
      currentPage = e.data;
      flashUI();
    });

    // Trackpad gesture support
    detachGestures = attachTrackpadGestures(container, {
      onSwipeLeft: () => pageFlip?.flipNext(),
      onSwipeRight: () => pageFlip?.flipPrev(),
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);

    hideUIAfterDelay();
  });

  onDestroy(() => {
    pageFlip?.destroy();
    detachGestures?.();
    document.removeEventListener('keydown', handleKeydown);
    clearTimeout(uiTimeout);
  });

  function handleKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        pageFlip?.flipNext();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        pageFlip?.flipPrev();
        break;
      case 'Escape':
        onClose();
        break;
    }
  }

  function handleMouseMove() {
    flashUI();
  }
</script>

<div
  class="reader"
  bind:this={container}
  onmousemove={handleMouseMove}
  role="application"
>
  <!-- Top bar -->
  <div class="topbar" class:visible={showUI}>
    <button class="close-btn" onclick={onClose} title="Close (Esc)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
    <span class="title">{title}</span>
    <span class="page-info">{currentPage + 1} / {totalPages}</span>
  </div>

  <!-- Page flip container -->
  <div class="flipbook-container">
    <div bind:this={pageFlipEl} class="flipbook"></div>
  </div>

  <!-- Bottom progress bar -->
  <div class="progress" class:visible={showUI}>
    <div class="progress-track">
      <div
        class="progress-fill"
        style="width: {totalPages > 1 ? (currentPage / (totalPages - 1)) * 100 : 0}%"
      ></div>
    </div>
  </div>
</div>

<style>
  .reader {
    width: 100vw;
    height: 100vh;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: none;
  }

  .reader:hover {
    cursor: default;
  }

  .topbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 48px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
    z-index: 100;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .topbar.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text);
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: background 0.15s;
  }

  .close-btn:hover {
    background: rgba(255,255,255,0.1);
  }

  .title {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 16px;
  }

  .page-info {
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    font-variant-numeric: tabular-nums;
    min-width: 60px;
    text-align: right;
  }

  .flipbook-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .flipbook {
    display: block;
  }

  .progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 24px;
    z-index: 100;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .progress.visible {
    opacity: 1;
  }

  .progress-track {
    width: 100%;
    height: 3px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 2px;
    transition: width 0.3s ease-out;
  }
</style>
