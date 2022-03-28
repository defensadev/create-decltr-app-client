export interface DecltrEvent {
  pair: string;
  volume: string;
  profit: string;
}

export interface DecltrDevEvent extends DecltrEvent {
  /**
   * The start time of the graph in dev tools
   */
  startTime: number;
  /**
   * The end time of the graph in dev tools
   */
  endTime: number;
}
