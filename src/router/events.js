import { db } from "@/main";
import { doc, addDoc, deleteDoc, collection } from "firebase/firestore";

export const addEvent = async (event) => {
  try {
    // Add new event to database
    const docRef = await addDoc(collection(db, "calEvent"), event);

    // Success feedback
    console.log("Successfully added event with ID: ", docRef.id);
    return {
      success: true,
      message: "Event added successfully.",
    };
  } catch (err) {
    console.error("Error adding event.");
    return {
      success: false,
      message: "An error occurred while adding the event.",
      error: err,
    };
  }
};

export const deleteEvent = async (id) => {
  try {
    const docRef = doc(db, "calEvent", id);
    await deleteDoc(docRef);

    // Validate id
    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Invalid ID provided.",
      };
    }

    console.log(`Event with ID ${id} deleted successfully.`);
    return {
      success: true,
      message: `Event with ID ${id} deleted successfully.`,
    };
  } catch (err) {
    console.error(`Error deleting event with ID ${id}`);
    return {
      success: false,
      message: `Failed to delete event with ID ${id}`,
      error: err,
    };
  }
};
