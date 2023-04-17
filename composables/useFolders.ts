import { addDoc, collection, deleteDoc, doc, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { useConfirm } from "primevue/useconfirm";
import { setDoc } from "@firebase/firestore";
import FolderData from "~/utils/FolderData";

const useFolders = () => {
  const user = useCurrentUser();
  const db = useFirestore();
  const foldersRef = collection(db, "folders");
  const { notes } = useSharedNotes();
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
        await deleteDoc(doc(foldersRef, id));
      },
    });
  };

  const renameFolder = async (id: string, value: string) => {
    const folder = folders.value.find((folder) => folder.id === id);
    if (!folder) return;
    await setDoc(doc(foldersRef, id), { title: value }, { merge: true });
  };

  return { folders, addFolder, deleteFolder, renameFolder };
};

export const useSharedFolders = createSharedComposable(useFolders);
