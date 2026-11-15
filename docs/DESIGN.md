# Open Doors design direction

Community event directory for Bengaluru residents who need practical information before committing to an event. The core idea is an open invitation: door outlines, paper tickets, and an arrival guide connect the visual language to the product.

Applied the user-supplied design-studio package: refactoring-ui, craftwork, Emil design engineering, and web-interface-guidelines. Variance 6, motion 3, density 4. The app prioritises direct interaction over cinematic effects, because a product about access must remain comfortable to use.

- Warm paper background, pale neutral surfaces, fine borders.
- Terracotta for actions; sage for confirmed access states.
- Manrope for interface and primary display. Instrument Serif for editorial emphasis.
- Rounded rectangles for events and dialogs; circular save buttons.
- Photography shows community activities. Event records and access claims are explicitly illustrative.
- 150–250 ms interaction feedback; reduced-motion and comfort display alternatives.
- Native dialog focus containment, labelled controls, visible keyboard focus, semantic buttons and a skip link.

## Key interactions

1. Access profile: six explicit preferences. Unknown values never count as a match.
2. Compatibility breakdown: supported, unavailable, and unknown access information remains visible.
3. Interactive arrival guide: entrance, seating, sound and transport details.
4. Reservations: MongoDB persistence, unique reference and calendar export.
5. Organiser workspace: create and edit events; publish attendee updates.
6. Session isolation: a teacher can experiment without affecting another visitor.

## Assets

Photographs downloaded from Unsplash and self-hosted under public/images. Fonts downloaded from Google Fonts and self-hosted under public/fonts. Icons from lucide-react (ISC license). See ASSETS.md for image source links.
