import { db } from "@/main";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

export const addStaff = async (person) => {
  try {
    // format the values for the final object
    const firstName = person.firstName.trim();
    const lastName = person.lastName.trim();
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    const initials = firstInitial + lastInitial;
    const shortName = firstInitial + ". " + lastName;
    const id = (firstName + "-" + lastName).toLowerCase();

    // Reference to the staff document
    const docRef = doc(db, "staff", id);

    // Check if document already exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.warn(`Staff member with ID "${id}" already exists.`);
      return {
        success: false,
        message: "Staff member already exists.",
      };
    }

    // Add the new member to the database
    await setDoc(docRef, {
      firstName: firstName,
      lastName: lastName,
      initials: initials,
      shortName: shortName,
    });

    //Success feedback
    console.log(`Successfully added staff member: ${shortName}`);
    return {
      success: true,
      message: "Staff member added succesfully.",
    };
  } catch (err) {
    console.error("Error adding staff:", err);
    return {
      success: false,
      message: "An error occurred while adding the staff member.",
      error: err,
    };
  }
};

export const deleteStaff = async (id) => {
  try {
    const docRef = doc(db, "staff", id);
    await deleteDoc(docRef);

    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Invalid ID provided.",
      };
    }

    console.log(`Staff with ID "${id}" deleted successfully.`);
    return {
      success: true,
      message: `Staff with ID "${id} deleted successfully.`,
    };
  } catch (err) {
    console.error(`Error deleting staff with ID "${id}:`, err);
    return {
      success: false,
      message: `Failed to delete staff with ID "${id}.`,
      error: err,
    };
  }
};
