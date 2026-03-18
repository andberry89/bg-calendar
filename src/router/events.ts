import { addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getEventsCollection } from '@/services';
import type { MutationResult, NewCalendarEvent } from '@/types/calendar';

export const addEvent = async (event: NewCalendarEvent): Promise<MutationResult> => {
  try {
    const docRef = await addDoc(getEventsCollection(), event);

    console.log('Successfully added event with ID: ', docRef.id);

    return {
      success: true,
      message: 'Event added successfully.'
    };
  } catch (err) {
    console.error('Error adding event.', err);

    return {
      success: false,
      message: 'An error occurred while adding the event.',
      error: err
    };
  }
};

export const deleteEvent = async (id: string): Promise<MutationResult> => {
  try {
    if (!id) {
      return {
        success: false,
        message: 'Invalid ID provided.'
      };
    }

    const docRef = doc(getEventsCollection(), id);
    await deleteDoc(docRef);

    console.log(`Event with ID ${id} deleted successfully.`);

    return {
      success: true,
      message: `Event with ID ${id} deleted successfully.`
    };
  } catch (err) {
    console.error(`Error deleting event with ID ${id}`, err);

    return {
      success: false,
      message: `Failed to delete event with ID ${id}`,
      error: err
    };
  }
};
