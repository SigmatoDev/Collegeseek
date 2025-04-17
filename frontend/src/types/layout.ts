export interface Widget {
  id: string;
  type: 'heading' | 'text' | 'button' | 'table' | 'accordion' | 'image';
  content: any;
}

export interface Column {
  id: string;
  widgets: Widget[];
}

export interface Section {
  id: string;
  columns: Column[];
}

export interface TableContent {
  rows: number;
  cols: number;
  data: string[][];
}