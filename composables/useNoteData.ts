import { ref as dbRef, set, update, serverTimestamp } from "firebase/database";

interface NoteData {
  content: string;
  lastUpdate: number;
}

export const useNoteData = (noteId: string) => {
  const db = useDatabase();

  const user = useCurrentUser();

  if (!user.value || !noteId || process.server) {
    return { data: ref(null), set: () => false, update: () => false };
  }

  const NoteData = useDatabaseObject<NoteData>(dbRef(db, "userNotes/" + user.value.uid + "/" + noteId));

  const setNoteData = async (data: Record<string, any>) => {
    if (!user.value) {
      return false;
    }
    await set(dbRef(db, "userNotes/" + user.value.uid + "/" + noteId), { ...data, lastUpdate: serverTimestamp() });
    return true;
  };

  const updateNoteData = async (data: Record<string, any>) => {
    if (!user.value) {
      return false;
    }
    await update(dbRef(db, "userNotes/" + user.value.uid + "/" + noteId), { ...data, lastUpdate: serverTimestamp() });
    return true;
  };

  return { data: NoteData, set: setNoteData, update: updateNoteData };
};
