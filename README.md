# DaorsVibes

DaorsVibes is a comprehensive web application designed for musicians to enhance their practice, performance, and creative workflow. It offers a suite of powerful tools to manage song data, practice effectively, and explore new musical ideas.

## Core Features:

- **Document Player**: Display lyrics, chords, and setlists in a highly readable format, with options for split-screen mode, font size adjustments, and night mode.
- **Chord/Lyric Import**: Import song data from public APIs, GitHub chord scraper, or manual input via text/file uploads, supporting formats like TXT, PDF, and ChordPro.
- **Auto-Scrolling Lyrics**: Automatically scroll lyrics at adjustable speeds, customizable based on BPM detection, with pause/resume functionality and sync with audio playback.
- **Setlist Management**: Organize songs into customizable setlists with drag-and-drop functionality, add notes, rearrange order, share via email/cloud storage, and archive sets.
- **Transposition**: Transpose chords to different keys with a single click, supporting all standard keys and capo adjustments with real-time previews.
- **Automatic Key Change Suggestion**: AI-powered tool to suggest optimal key changes for a given audio URL.
- **Audio Integration**: Seamlessly integrate audio playback from URLs, local files, or services like Spotify/YouTube.

## Technologies Used:

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)
- **AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)

## Getting Started:

To get a local copy up and running, follow these simple steps.

### Prerequisites:

- [Node.js](https://nodejs.org/) (version 20.0.0 or higher)
- [npm](https://www.npmjs.com/)

### Installation:

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/your_username_/your_project_name.git
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Set up Firebase:**
    *   Create a project on the [Firebase Console](https://console.firebase.google.com/).
    *   Enable Authentication (Email/Password, Google, etc.).
    *   Set up Firestore.
    *   Get your Firebase project configuration. Go to your project's settings and find your web app's configuration object.
4.  **Set up environment variables:**
    *   Create a `.env.local` file in the root of the project.
    *   Copy the contents of `.env.example` into `.env.local`.
    *   Replace the placeholder values in `.env.local` with your actual Firebase project configuration.

### Running the application:

```sh
npm run dev
```

This will start the development server at `http://localhost:3000`.

## Scripts:

- `npm run dev`: Starts the development server.
- `npm run genkit:dev`: Starts the Genkit development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the code.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

## Styling:

This project follows the styling guidelines outlined in `docs/blueprint.md`, which includes a specific color palette, typography, and layout principles to create a serene and user-friendly experience.

## Roadmap

Our roadmap includes the following planned features:

- **YouTube Transcription Tool**: An AI-powered tool to transcribe YouTube videos and generate synchronized lyrics and chords.
- **Advanced Audio Integration**: Deeper integration with services like Spotify and Apple Music.
- **Collaborative Setlists**: Allow multiple users to edit and contribute to setlists in real-time.

## Contributing

Contributions are welcome! Please see our [contributing guidelines](CONTRIBUTING.md) for more details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
