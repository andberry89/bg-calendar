import { db } from "@/firebase";
import { doc, addDoc, deleteDoc, collection, Timestamp } from "firebase/firestore";

function toMidnightTimestamp(yyyyMmDd) {
  // store as UTC midnight to avoid timezone issues
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return Timestamp.fromDate(new Date(Date.UTC(y, m-1, d, 0, 0, 0)));
}

export const addEvent = async (event) => {
  try {
    const payload = {
      ...event,
      startAt: toMidnightTimestamp(event.start),
      endAt: toMidnightTimestamp(event.end || event.start),
    };

    const docRef = await addDoc(collection(db, "calEvent"), payload);

    return {
      success: true,
      message: "Event added successfully.",
      id: docRef.id,
    };
  } catch (err) {
    return {
      success: false,
      message: "An error occurred while adding the event.",
      error: err,
    };
  }
};

export const deleteEvent = async (id) => {
  try {
    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Invalid ID provided.",
      };
    }

    const docRef = doc(db, "calEvent", id);
    await deleteDoc(docRef);

    return {
      success: true,
      message: `Event with ID ${id} deleted successfully.`,
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to delete event with ID ${id}`,
      error: err,
    };
  }
};
