interface IComment {
  _id: string;
  username: string;
  text: string;
}

interface ITrack {
  _id: string;
  name: string;
  artist: string;
  text: string;
  listens: number;
  audio: string;
  picture: string;
  comments: IComment[];
}

export { type ITrack, type IComment };
