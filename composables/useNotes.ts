import { collection, orderBy, query, where } from "firebase/firestore";
import NoteData from "~/utils/NoteData";

export const useNotes = () => {
  const user = useCurrentUser();
  const db = useFirestore();
  const notesRef = collection(db, "notes");

  const notesQuery = query(notesRef, where("owner", "==", user.value!.uid), orderBy("created", "asc"));

  return useCollection<NoteData>(notesQuery);
};
