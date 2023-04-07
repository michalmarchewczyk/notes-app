import { FieldValue } from "@firebase/firestore";

interface NoteData {
  id: string;
  owner: string;
  title: string;
  created: FieldValue;
  folder: string | null;
}

export default NoteData;
