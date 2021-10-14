export interface DrawingElements {
  rectangles: Rectangle[];
  circles: Circle[];
  icons: Icon[]
}


export interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
}


export interface Icon {
  x: number;
  y: number;
  w: number;
  h: number;
  icon: string;
}

export interface Circle {
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
}
