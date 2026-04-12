import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStaffCollection } from '@/services';
import type { MutationResult, NewStaffInput, StaffDocument } from '@/types/calendar';

export const addStaff = async (person: NewStaffInput): Promise<MutationResult> => {
  try {
    const firstName = person.firstName.trim();
    const lastName = person.lastName.trim();
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    const initials = firstInitial + lastInitial;
    const shortName = firstInitial + '. ' + lastName;
    const id = (firstName + '-' + lastName).toLowerCase();

    const docRef = doc(getStaffCollection(), id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        success: false,
        message: 'Staff member already exists.'
      };
    }

    const staffDocument: StaffDocument = {
      firstName,
      lastName,
      initials,
      shortName
    };

    await setDoc(docRef, staffDocument);

    return {
      success: true,
      message: 'Staff member added succesfully.'
    };
  } catch (err) {
    return {
      success: false,
      message: 'An error occurred while adding the staff member.',
      error: err
    };
  }
};

export const deleteStaff = async (id: string): Promise<MutationResult> => {
  try {
    if (!id) {
      return {
        success: false,
        message: 'Invalid ID provided.'
      };
    }

    const docRef = doc(getStaffCollection(), id);
    await deleteDoc(docRef);

    return {
      success: true,
      message: `Staff with ID "${id}" deleted successfully.`
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to delete staff with ID "${id}".`,
      error: err
    };
  }
};
