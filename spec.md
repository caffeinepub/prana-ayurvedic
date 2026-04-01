# Prana Ayurvedic

## Current State
The website has a public reviews section where customers can leave star ratings and comments. The admin panel (Reviews tab) shows all reviews with a delete option. There is no ability for the admin to respond to individual reviews.

## Requested Changes (Diff)

### Add
- `replyToReview(id: Nat, reply: Text)` backend endpoint to store admin reply on a review
- `adminReply: ?Text` field on the Review type in the backend
- In the admin panel Reviews tab: a reply input box + "Reply" button for each review
- On the public reviews section: show admin reply beneath the customer review when one exists (styled differently to indicate it's from Prana)

### Modify
- Review type in backend to include optional `adminReply` field
- `getAllReviews` returns updated Review objects with reply field
- `ReviewCard` component to render admin reply block
- AdminPanel `ReviewsTab` to include reply form per review

### Remove
- Nothing removed

## Implementation Plan
1. Update `main.mo`: add `adminReply: ?Text` to Review type, add `replyToReview(id, reply)` function that updates the stored review with a reply
2. Update frontend `ReviewCard` to display admin reply when present
3. Update `AdminPanel` ReviewsTab to show a textarea + submit button for each review allowing the admin to add/update their reply
