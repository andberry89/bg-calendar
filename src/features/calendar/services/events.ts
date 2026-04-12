import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getEventsCollection } from '@/services';
import type { CalendarEventDocument, MutationResult, NewCalendarEvent } from '@/types/calendar';

const mapNewEventToDocument = (event: NewCalendarEvent): CalendarEventDocument => {
  return {
    class: event.class,
    closed: event.closed,
    details: event.details,
    end: event.end,
    start: event.start,
    staff: event.staff,
    type: event.type
  };
};

export const addEvent = async (event: NewCalendarEvent): Promise<MutationResult> => {
  try {
    const eventDocument = mapNewEventToDocument(event);
    const docRef = await addDoc(getEventsCollection(), eventDocument);

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

export const updateEvent = async (id: string, event: NewCalendarEvent): Promise<MutationResult> => {
  try {
    if (!id) {
      return {
        success: false,
        message: 'Invalid ID provided.'
      };
    }

    const eventDocument = mapNewEventToDocument(event);
    const docRef = doc(getEventsCollection(), id);

    await updateDoc(docRef, eventDocument);

    console.log(`Event with ID ${id} updated successfully.`);

    return {
      success: true,
      message: `Event with ID ${id} updated successfully.`
    };
  } catch (err) {
    console.error(`Error updating event with ID ${id}`, err);

    return {
      success: false,
      message: `Failed to update event with ID ${id}`,
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
