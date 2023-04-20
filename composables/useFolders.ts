import { addDoc, collection, deleteDoc, doc, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { useConfirm } from "primevue/useconfirm";
import { setDoc } from "@firebase/firestore";
import FolderData from "~/utils/FolderData";

const useFolders = () => {
  const user = useCurrentUser();
  const db = useFirestore();
  const foldersRef = collection(db, "folders");
  const { notes, updateNoteParent, deleteNote } = useSharedNotes();
  const confirm = useConfirm();

  const foldersQuery = query(foldersRef, where("owner", "==", user.value!.uid), orderBy("created", "asc"));
  const folders = useCollection<FolderData>(foldersQuery);

  const addFolder = async (parent: string | null) => {
    if (parent && notes.value?.find((note) => note.id === parent)) {
      parent = notes.value?.find((note) => note.id === parent)?.folder ?? null;
    }
    return await addDoc(foldersRef, {
      owner: user.value?.uid,
      title: "New Folder",
      created: serverTimestamp(),
      parent,
    } as Omit<FolderData, "id">);
  };

  const deleteFolder = (id: string) => {
    const folder = folders.value.find((folder) => folder.id === id);
    if (!folder) return;
    confirm.require({
      message: "Are you sure you want to delete this folder?",
      header: "Delete folder " + folder.title + "?",
      icon: "ti ti-alert-triangle",
      accept: async () => {
        const childNotes = notes.value.filter((note) => note.folder === id);
        const childFolders = folders.value.filter((folder) => folder.parent === id);
        for (const note of childNotes) {
          await updateNoteParent(note.id, folder.parent);
        }
        for (const f of childFolders) {
          await updateFolderParent(f.id, folder.parent);
        }
        await deleteDoc(doc(foldersRef, id));
      },
    });
  };

  const deleteFolderRecursive = async (id: string, force = false) => {
    const folder = folders.value.find((folder) => folder.id === id);
    if (!folder) return;
    if (force) {
      const childNotes = notes.value.filter((note) => note.folder === id);
      const childFolders = folders.value.filter((f) => f.parent === id);
      for (const note of childNotes) {
        await deleteNote(note.id, true);
      }
      for (const f of childFolders) {
        await deleteFolderRecursive(f.id, true);
      }
      await deleteDoc(doc(foldersRef, id));
      return;
    }
    confirm.require({
      message: "Are you sure you want to delete this folder with all its contents?",
      header: "Delete folder " + folder.title + " with contents?",
      icon: "ti ti-alert-triangle",
      accept: async () => {
        await deleteFolderRecursive(id, true);
      },
    });
  };

  const renameFolder = async (id: string, value: string) => {
    const folder = folders.value.find((folder) => folder.id === id);
    if (!folder) return;
    await setDoc(doc(foldersRef, id), { title: value }, { merge: true });
  };

  const updateFolderParent = async (id: string, value: string | null) => {
    const folder = folders.value.find((folder) => folder.id === id);
    if (!folder) return;
    await setDoc(doc(foldersRef, id), { parent: value }, { merge: true });
  };

  return { folders, addFolder, deleteFolder, deleteFolderRecursive, renameFolder, updateFolderParent };
};

export const useSharedFolders = createSharedComposable(useFolders);
