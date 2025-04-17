type WidgetType =
  | { type: 'heading'; content: string }
  | { type: 'text'; content: string }
  | { type: 'button'; content: string }
  | { type: 'image'; content: { url: string; alt: string } }
  | { type: 'accordion'; content: { title: string; content: string; isOpen: boolean } }
  | { type: 'table'; content: TableContent | null };

  export interface TableContent {
    rows: number;
    cols: number;
    data: string[][];
  }
  