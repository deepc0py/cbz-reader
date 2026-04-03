declare module 'page-flip' {
  export interface FlipSetting {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    showPageCorners?: boolean;
    startPage?: number;
    disableFlipByClick?: boolean;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: FlipSetting);
    loadFromImages(imagesHref: string[]): void;
    loadFromHTML(elements: NodeListOf<Element> | HTMLElement[]): void;
    flipNext(corner?: string): void;
    flipPrev(corner?: string): void;
    flip(pageNum: number, corner?: string): void;
    turnToPage(pageNum: number): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): string;
    destroy(): void;
    on(eventName: string, callback: (e: any) => void): PageFlip;
    update(): void;
  }
}
