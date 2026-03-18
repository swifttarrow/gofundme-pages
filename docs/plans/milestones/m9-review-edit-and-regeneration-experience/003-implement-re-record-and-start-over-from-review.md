# Task 003: Implement Re-Record and Start Over from Review

## Goal
Allow users to restart voice capture from the review experience when the generated draft misses intent.

## Deliverables
- [ ] `Start over with voice` action clears in-progress draft and returns to recording flow
- [ ] Existing draft can be discarded with explicit confirmation
- [ ] New recording replaces prior transcript and generated content cleanly

## Notes
Treat restart as a first-class path so users can recover quickly from poor initial recordings.

## Verification
From review, restart with voice, complete a new recording, and confirm the new draft fully replaces prior content.
