import { ref as dbRef, set, update, serverTimestamp } from "firebase/database";

interface UserData {
  noteTabs: string[];
  lastOpened: string[];
  theme: "light" | "dark";
  noteDates: boolean;
  editorLineNumbers: boolean;
}

const useUserData = () => {
  const db = useDatabase();

  const user = useCurrentUser();

  if (!user.value || process.server) {
    return { data: ref(null), set: () => false, update: () => false };
  }

  const userData = useDatabaseObject<UserData>(dbRef(db, "users/" + user.value.uid));

  const setUserData = async (data: Record<string, any>) => {
    if (!user.value) {
      return false;
    }
    await set(dbRef(db, "users/" + user.value.uid), data);
    return true;
  };

  const updateUserData = async (data: Record<string, any>) => {
    if (!user.value) {
      return false;
    }
    await update(dbRef(db, "users/" + user.value.uid), data);
    return true;
  };

  updateUserData({ lastLogin: serverTimestamp() });

  return { data: userData, set: setUserData, update: updateUserData };
};

export const useSharedUserData = createSharedComposable(useUserData);
