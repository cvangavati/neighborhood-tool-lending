# Neighborhood Tool Lending

Neighborhood Tool Lending is a mobile-first community board for sharing tools that would otherwise be purchased for one-off jobs. Users choose or create a community, list tools they own, mark availability, save tools for later, request a borrow, and coordinate pickup details through messages.

The project is designed to validate whether a neighborhood has enough density and trust for practical tool lending. It intentionally keeps the first version lightweight: there are no payments, ratings, insurance workflows, or public social feed.

## Current MVP

| Area | Included |
|---|---|
| Community setup | First-launch community creation and persisted community selection |
| Tool board | Search, category filters, availability labels, tool details, and empty states |
| Tool ownership | Post a tool and switch it between available and borrowed |
| Wishlist | Save tools for later and manage saved tools from the profile |
| Trust profile | Name, street name, short bio, and community context |
| Borrow requests | Sent and received request inboxes with local message threads |
| Pickup coordination | Propose a day and time, then accept or decline a proposal |
| Storage | Local persistence with AsyncStorage for the current device |
| Responsive layout | Shared adaptive containers for narrow, wide, portrait, and landscape screens |

## Product boundaries

This MVP is intentionally local-first and does not provide shared cloud synchronization. Data created in the app is stored on the current device. Authentication, multi-device collaboration, push notifications, payments, ratings, insurance, and moderation tools should be added only after the neighborhood trust hypothesis has been tested.

> Do not put real secrets, credentials, private keys, production database exports, or personal data into this repository.

## Technology

The app uses Expo SDK 54, React Native, Expo Router, TypeScript, NativeWind, React 19, AsyncStorage, and Vitest. The project is configured for portrait-first mobile use while allowing the interface to adapt to landscape and wider screens.

## Local development

Install Node.js and pnpm, then install dependencies from the project root:

```bash
pnpm install
```

Start the Expo web preview and local server with:

```bash
pnpm dev
```

Useful commands are listed below.

| Command | Purpose |
|---|---|
| `pnpm check` | Run the TypeScript compiler without emitting files |
| `pnpm test` | Run the Vitest test suite |
| `pnpm lint` | Run Expo lint checks |
| `pnpm format` | Format project files with Prettier |
| `pnpm ios` | Start the iOS Expo target when available |
| `pnpm android` | Start the Android Expo target when available |

## First-run flow

When the app opens without a selected community, it shows the community setup screen. The user enters a community name and an optional description. That context is then used for the board, profile, wishlist, requests, and newly posted tools. The selected community can be changed later from the profile screen.

## Security and privacy

Environment files, local runtime logs, Expo metadata, database files, credentials, private keys, and certificate artifacts are excluded by `.gitignore`. Secrets should be supplied through the development or deployment environment rather than committed to source control. If a secret is ever committed accidentally, rotate it immediately and remove it from the repository history; deleting the file alone is not sufficient.

The current MVP stores profile and lending data locally on the device. Street information should remain approximate and limited to what a user is comfortable sharing. A production release should add authentication, server-side authorization, encrypted transport, data deletion controls, abuse reporting, and a clear privacy policy before handling real community data.

## Testing

The repository includes deterministic tests for the local state boundaries, empty first-run behavior, wishlist behavior, profile trust fields, pickup proposals, and community selection persistence. Run the complete validation set with:

```bash
pnpm check && pnpm test && pnpm lint
```

## Project structure

```text
app/                 Expo Router screens and tab navigation
components/          Shared layout and UI components
lib/app-state.tsx    Local state, persistence, and domain models
assets/images/       Expo icon and splash assets
server/              Template server capabilities for future integrations
tests/               Deterministic Vitest coverage
theme.config.js      Shared brand palette
todo.md              Feature and validation history
```

## Roadmap

The most valuable next step is shared cloud storage with authentication so multiple neighbors can see the same community board. After that, the project can add push notifications, invite links, moderation controls, and privacy-aware community membership. These additions should be guided by observed usage rather than assumed demand.

## License

No license has been selected yet. Choose and add an explicit license before distributing the project publicly or accepting external contributions.
