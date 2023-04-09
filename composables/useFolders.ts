import { collection, orderBy, query, where } from "firebase/firestore";
import FolderData from "~/utils/FolderData";

export const useFolders = () => {
  const user = useCurrentUser();
  const db = useFirestore();
  const foldersRef = collection(db, "folders");

  const foldersQuery = query(foldersRef, where("owner", "==", user.value!.uid), orderBy("created", "asc"));

  return useCollection<FolderData>(foldersQuery);
};
