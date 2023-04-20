import { addDoc, collection, deleteDoc, doc, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { useConfirm } from "primevue/useconfirm";
import { setDoc } from "@firebase/firestore";
import NoteData from "~/utils/NoteData";

const useNotes = () => {
  const user = useCurrentUser();
  const db = useFirestore();
  const notesRef = collection(db, "notes");
  const confirm = useConfirm();

  const notesQuery = query(notesRef, where("owner", "==", user.value!.uid), orderBy("created", "asc"));
  const notes = useCollection<NoteData>(notesQuery);

  const addNote = async (parent: string | null) => {
    if (parent && notes.value?.find((note) => note.id === parent)) {
      parent = notes.value?.find((note) => note.id === parent)?.folder ?? null;
    }
    return await addDoc(notesRef, {
      owner: user.value?.uid,
      title: "New Note",
      created: serverTimestamp(),
      folder: parent,
    } as Omit<NoteData, "id">);
  };

  const deleteNote = async (id: string, force = false) => {
    const note = notes.value.find((note) => note.id === id);
    if (!note) return;
    if (force) {
      await deleteDoc(doc(notesRef, id));
      return;
    }
    confirm.require({
      message: "Are you sure you want to delete this note?",
      header: "Delete note " + note.title + "?",
      icon: "ti ti-alert-triangle",
      accept: async () => {
        await deleteDoc(doc(notesRef, id));
      },
    });
  };

  const renameNote = async (id: string, value: string) => {
    const note = notes.value.find((note) => note.id === id);
    if (!note) return;
    await setDoc(doc(notesRef, id), { title: value }, { merge: true });
  };

  const updateNoteParent = async (id: string, value: string | null) => {
    const note = notes.value.find((note) => note.id === id);
    if (!note) return;
    await setDoc(doc(notesRef, id), { folder: value }, { merge: true });
  };

  return { notes, addNote, deleteNote, renameNote, updateNoteParent };
};

export const useSharedNotes = createSharedComposable(useNotes);
