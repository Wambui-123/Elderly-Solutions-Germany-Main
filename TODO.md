# Project TODO List

This document outlines the remaining work to complete the application.

## Backend & Database Integration

- [ ] **Connect to Firebase:** The app currently uses mock data (`src/lib/data.ts`). All components need to be updated to fetch and write data to Firestore using the defined schema in `docs/backend.json`.
- [ ] **Implement Firebase Authentication:** Replace the mock login/signup logic in `src/lib/actions.ts` with real Firebase Authentication calls.
- [ ] **User Data Management:** When a new user signs up, create a corresponding user document in the `/users/{userId}` collection in Firestore.

## Missing Pages

- [ ] **Patient Detail Page:** A page for caregivers and professionals to view a single patient's detailed health information, including all health logs, medication history, and notes. This would likely be at a route like `/dashboard/patients/{patientId}`.
- [ ] **Billing Page:** The user navigation menu has a "Billing" link, but the page does not exist. A page needs to be created at `/dashboard/billing` to manage subscriptions or payment methods.
- [ ] **Appointments Page:** The application logic implies appointments (e.g., "Upcoming Appointment" card), but there is no dedicated page to view or manage them. A page at `/dashboard/appointments` is needed.

## Component Functionality

- [ ] **Community Hub (`/dashboard/community`):**
    - Implement real-time chat using Firestore.
    - Allow users to search and add new contacts.
- [ ] **Health Page (`/dashboard/health`):**
    - Connect the `VitalsChart` to live data from Firestore.
    - Implement the "Add Medication" functionality.
    - Implement logic for tracking medication status (`Taken`, `Upcoming`, `Missed`) for each day, perhaps in a `medication_logs` collection.
- [ ] **Profile Page (`/dashboard/profile`):**
    - Implement the "Save Changes" functionality for personal information.
    - Implement "Change Photo" functionality, including uploading the image.
    - Make the accessibility and notification settings functional.
- [ ] **Admin Dashboard (`/dashboard` for admins):**
    - Build out user management features (e.g., list, view, edit users).
    - Build out platform monitoring tools.

## AI Feature Enhancements

- [ ] **Contextual AI:** The AI assistants in the "Knowledge Hub" should be provided with real user data (e.g., health logs for the professional's summary AI) from Firestore to provide truly personalized responses.
