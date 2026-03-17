import { getStaffCollection } from '@/services';

export const addStaff = async (person) => {
  try {
    const firstName = person.firstName.trim();
    const lastName = person.lastName.trim();
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    const initials = firstInitial + lastInitial;
    const shortName = firstInitial + '. ' + lastName;
    const id = (firstName + '-' + lastName).toLowerCase();

    const docRef = getStaffCollection().doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      console.warn(`Staff member with ID "${id}" already exists.`);
      return {
        success: false,
        message: 'Staff member already exists.'
      };
    }

    await docRef.set({
      firstName,
      lastName,
      initials,
      shortName
    });

    console.log(`Successfully added staff member: ${shortName}`);

    return {
      success: true,
      message: 'Staff member added succesfully.'
    };
  } catch (err) {
    console.error('Error adding staff:', err);

    return {
      success: false,
      message: 'An error occurred while adding the staff member.',
      error: err
    };
  }
};

export const deleteStaff = async (id) => {
  try {
    if (!id || typeof id !== 'string') {
      return {
        success: false,
        message: 'Invalid ID provided.'
      };
    }

    const docRef = getStaffCollection().doc(id);
    await docRef.delete();

    console.log(`Staff with ID "${id}" deleted successfully.`);

    return {
      success: true,
      message: `Staff with ID "${id}" deleted successfully.`
    };
  } catch (err) {
    console.error(`Error deleting staff with ID "${id}"`, err);

    return {
      success: false,
      message: `Failed to delete staff with ID "${id}".`,
      error: err
    };
  }
};
