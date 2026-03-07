# Prana Ayurvedic

## Current State
A single-page Ayurvedic home service website with sections: Hero, About, Services, Gallery, Contact/Booking, Footer. Customers can submit a booking (name, phone, service) via the ContactSection form, which stores data via `submitInquiry()` in the Motoko backend. The backend also has `getAllInquiries()` which returns all bookings, but there is no admin UI to view them.

## Requested Changes (Diff)

### Add
- Admin panel page/view accessible via a hidden route (`/admin`) or a secret URL path
- Simple password-protected login screen (client-side password, e.g. "prana2024") to guard the admin panel
- Bookings list table showing: customer name, phone number, and selected service for each inquiry
- A logout button to return to the login screen

### Modify
- App routing: support toggling between the main landing page and the admin panel view (no full router needed — use URL hash or a simple state-based approach)
- Navbar: add a discreet "Admin" link (small, subtle, in the footer area or accessible via URL) so the owner can navigate to it

### Remove
- Nothing removed

## Implementation Plan
1. Create `AdminPanel.tsx` component:
   - Login screen with password input (hardcoded password "prana2024") and submit button
   - On successful login, show bookings table
   - Bookings table columns: Name, Phone, Service
   - Calls `useGetAllInquiries` (or directly calls backend) to fetch all bookings
   - Loading and empty states
   - Logout button
2. Update `App.tsx` to detect `?admin` or `#admin` in the URL and render `AdminPanel` instead of the main site
3. Add a subtle "Admin" link in the Footer (small, low-opacity) that navigates to the admin view
4. Add a `useGetAllInquiries` hook in hooks/useQueries.ts
