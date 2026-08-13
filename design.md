# Neighborhood Tool Lending — Mobile Interface Design

## Product direction

Neighborhood Tool Lending is a local-first, trust-oriented board for sharing tools that would otherwise be purchased for one-off jobs. The MVP should feel calm, practical, and neighborly rather than transactional. It intentionally excludes ratings, insurance, payments, and public social feeds.

The experience assumes portrait orientation and one-handed use. Primary actions stay near the lower half of the screen, cards have generous touch targets, and navigation uses a simple iOS-style tab bar.

## Screen list

| Screen | Primary content and functionality |
|---|---|
| Home / Nearby | Greeting, current neighborhood, search field, category chips, and a list of nearby tools. Each tool card shows photo treatment, name, owner, distance, and availability. |
| Tool detail | Large tool visual, name, owner, neighborhood, description, availability badge, and a prominent “Request to borrow” action. |
| Add a tool | Form for tool name, category, description, and availability. Includes a lightweight visual picker instead of requiring photo permissions in the MVP. |
| Requests | Segmented view for requests received and sent. Each row shows the tool, neighbor, request status, and a short message preview. |
| Request conversation | Message-style thread for discussing pickup details. Includes a composer and a simulated send action for the local MVP. |
| Profile / My tools | Owner identity, neighborhood, trust statement, and the user’s posted tools with availability toggles. |

## Key user flows

### Browse and request

1. The user opens Home and sees tools available in their neighborhood.
2. The user searches or taps a category chip to narrow the list.
3. The user taps a tool card to open Tool detail.
4. The user taps “Request to borrow.”
5. The app creates a local request and opens the Request conversation.
6. The user sends a short pickup message; the request appears in Requests as pending.

### Post a tool

1. The user taps the add button in the tab bar or the “List a tool” empty-state action.
2. The user enters a tool name, chooses a category, writes an optional note, and selects Available or Borrowed.
3. The user taps “Post tool.”
4. The new tool appears at the top of the user’s My tools list and in Home when available.

### Manage availability

1. The user opens Profile / My tools.
2. The user taps the availability control on a posted tool.
3. The card updates immediately between Available and Borrowed, with a small confirmation state.

### Continue a conversation

1. The user opens Requests.
2. The user chooses Sent or Received.
3. The user taps a request row.
4. The user reads the thread and sends a follow-up message from the composer.

## Visual system

The brand uses **Workshop Green** (`#2F6B4F`) for primary actions and active states, communicating usefulness and stewardship. **Warm Sawdust** (`#F6F1E8`) is the main background, while **Paper White** (`#FFFCF7`) is reserved for elevated cards. **Ink** (`#1F2924`) is the primary text color and **Slate Moss** (`#6D7C73`) is secondary text. Available status uses **Leaf** (`#3B8C64`), borrowed status uses **Amber** (`#B7791F`), and destructive/error states use **Brick** (`#B84C3A`).

Cards use 18–22 px corner radii, thin warm-gray borders, and restrained shadows. Tool visuals use simple illustrated color blocks and line icons to keep the MVP fast and recognizable without requiring photo storage. Typography should use a strong, compact display style for screen titles and a highly legible system sans for body copy.

## Interaction principles

Every primary control should have a clear pressed state and a touch target of at least 44 points. The app should provide immediate local feedback when a tool is posted, availability is changed, or a request message is sent. Empty states should explain what the user can do next rather than displaying a blank list. The core flows must work without authentication, server sync, payments, or device permissions; local state is sufficient for validating neighborhood density and trust behavior in the MVP.
