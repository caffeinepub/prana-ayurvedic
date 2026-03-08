# Prana Ayurvedic

## Current State
- Full website with hero, about, services, gallery, booking form, contact, and service area map sections
- Booking (inquiry) system: visitors submit name, phone, service — stored in backend
- Admin panel with password login to view all bookings, new booking badge notifications
- Countdown to 15 March 2026 with launch celebration animation
- "Check My Area" zone lookup tool in the map section

## Requested Changes (Diff)

### Add
- **Review data type** in the backend: id (Nat), name (Text), rating (Nat — 1–5), comment (Text), timestamp (Int)
- **submitReview** backend function: any visitor can submit a review (name, rating, comment)
- **getAllReviews** backend function: returns all reviews sorted by newest first
- **deleteReview** backend function: admin-only delete by review id
- **Reviews & Testimonials section** on the homepage (placed between Gallery and Contact sections)
  - Star rating display (filled/empty gold stars)
  - Customer name, comment, and date
  - Animated card grid, responsive
  - Average star rating summary at top
- **Leave a Review modal** — floating button visible from any section on the page
  - Form: name (text), star rating picker (1–5), comment (textarea)
  - Submits immediately, shows in public reviews right away
- **Admin panel reviews tab** — alongside bookings, a "Reviews" tab listing all reviews with delete button per row

### Modify
- Admin panel: add tab navigation between "Bookings" and "Reviews"
- Navbar: add "Reviews" nav link scrolling to the reviews section

### Remove
- Nothing removed

## Implementation Plan
1. Update `main.mo` to add Review type, submitReview, getAllReviews, deleteReview
2. Update `backend.d.ts` to reflect new API
3. Add ReviewsSection component to App.tsx (between Gallery and Contact)
4. Add floating "Leave a Review" button with modal form
5. Add Reviews tab to AdminPanel.tsx with delete functionality
6. Add "Reviews" link to navbar navLinks array
7. Wire up new backend hooks in useQueries.ts
