import { collection, orderBy, query, where } from "firebase/firestore";
import NoteData from "~/utils/NoteData";

const useNotes = () => {
  const user = useCurrentUser();
  const db = useFirestore();
  const notesRef = collection(db, "notes");

  const notesQuery = query(notesRef, where("owner", "==", user.value!.uid), orderBy("created", "asc"));

  return useCollection<NoteData>(notesQuery);
};

export const useSharedNotes = createSharedComposable(useNotes);
