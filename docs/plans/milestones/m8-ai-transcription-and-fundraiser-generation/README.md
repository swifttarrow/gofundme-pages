# Milestone 8: AI Transcription and Fundraiser Generation

## Overview
Build the AI pipeline that converts voice input into structured fundraiser draft content while enforcing safety, grounding, and confidence checks.

## Dependencies
- [ ] Milestone 7
- [ ] Speech-to-text provider and model access configured

## Changes Required
Implement transcription, entity extraction, generation of title/summary/story/goal/category, and moderation checks per [AI System Requirements](../../requirements/voice-dictation-for-creating-fundraisers.md#-ai-system-requirements).

## Success Criteria

### Automated Verification
- [ ] Integration tests verify transcript-to-draft output schema and field limits
- [ ] Safety pipeline tests block disallowed content and surface actionable errors
- [ ] Prompt grounding tests ensure generated content is traceable to transcript

### Manual Verification
- [ ] Processing state transitions smoothly and resolves to editable draft output
- [ ] Generated title, summary, and story are coherent for diverse sample inputs
- [ ] Confidence score is present and low-confidence cases are flagged for user review

## Tasks
- [001-integrate-speech-to-text-and-transcript-normalization](./001-integrate-speech-to-text-and-transcript-normalization.md)
- [002-generate-structured-fundraiser-content-from-transcript](./002-generate-structured-fundraiser-content-from-transcript.md)
- [003-add-safety-grounding-and-confidence-gates](./003-add-safety-grounding-and-confidence-gates.md)
