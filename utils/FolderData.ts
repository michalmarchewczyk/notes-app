import { FieldValue } from "@firebase/firestore";

interface FolderData {
  id: string;
  owner: string;
  title: string;
  created: FieldValue;
  parent: string | null;
}

export default FolderData;
