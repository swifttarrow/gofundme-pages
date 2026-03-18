# Task 001: Integrate Speech-to-Text and Transcript Normalization

## Goal
Convert captured audio into high-quality text suitable for reliable downstream generation.

## Deliverables
- [ ] Audio upload/ingest endpoint accepts 20-90 second clips and returns transcript
- [ ] Transcript normalization removes obvious filler and applies basic cleanup
- [ ] Error states return user-friendly messages for failed transcription

## Notes
Preserve raw transcript for auditing while storing normalized transcript for generation and UI rendering.

## Verification
Run integration tests against sample audio fixtures and validate transcript quality and failure handling.
