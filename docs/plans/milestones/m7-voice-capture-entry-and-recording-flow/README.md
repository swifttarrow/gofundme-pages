# Milestone 7: Voice Capture Entry and Recording Flow

## Overview
Deliver a mobile-first entry and recording experience where voice is the default, users are guided with prompts, and fallback typing remains one tap away.

## Dependencies
- [ ] Milestone 6
- [ ] Mobile audio recording permissions and browser support confirmed

## Changes Required
Implement entry-point routing, full-screen voice capture UI, recording controls, timing constraints, and fallback typing behavior per [Voice-First Fundraiser Creation MVP](../../requirements/voice-dictation-for-creating-fundraisers.md#-user-flow-happy-path).

## Success Criteria

### Automated Verification
- [ ] Component tests cover mic start/stop/pause/retry state transitions
- [ ] Validation enforces recording hard cap at 90 seconds
- [ ] Route tests confirm all entry points open the voice-first creation flow

### Manual Verification
- [ ] Entry screen is mobile-friendly and presents voice as primary CTA
- [ ] Recording shows live timer/waveform and rotating guidance prompts
- [ ] User can switch to typing mode without losing flow context

## Tasks
- [001-wire-start-fundraiser-entry-points-to-voice-flow](./001-wire-start-fundraiser-entry-points-to-voice-flow.md)
- [002-build-mobile-entry-screen-and-recording-ui](./002-build-mobile-entry-screen-and-recording-ui.md)
- [003-enforce-recording-limits-and-fallback-typing-mode](./003-enforce-recording-limits-and-fallback-typing-mode.md)
