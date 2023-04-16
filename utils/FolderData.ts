import { Timestamp } from "@firebase/firestore";

interface FolderData {
  id: string;
  owner: string;
  title: string;
  created: Timestamp;
  parent: string | null;
}

export default FolderData;
