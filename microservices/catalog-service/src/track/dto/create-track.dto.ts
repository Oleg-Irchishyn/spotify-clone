export interface CreateTrackDto {
  readonly name: string;
  readonly artist: string;
  readonly text?: string;
  readonly album?: string;
}
