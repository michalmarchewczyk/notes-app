import { ref as dbRef, set, update } from "firebase/database";

export const useUserData = () => {
  const db = useDatabase();

  const user = useCurrentUser();

  if (!user.value) {
    return { data: ref(null), set: () => false, update: () => false };
  }

  const userData = useDatabaseObject<{ noteTabs: string[]; lastOpened: string[] }>(
    dbRef(db, "users/" + user.value.uid)
  );

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

  if (!userData.value) {
    setUserData({ theme: "light" });
  }

  return { data: userData, set: setUserData, update: updateUserData };
};
