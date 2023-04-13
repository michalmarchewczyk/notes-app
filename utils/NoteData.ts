import { Timestamp } from "@firebase/firestore";

interface NoteData {
  id: string;
  owner: string;
  title: string;
  created: Timestamp;
  folder: string | null;
}

export default NoteData;
