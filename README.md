# LeetCode Tracker

A personal LeetCode problem tracking application with GitHub Gist backup.

## Features

- **Question Management**: Add, edit, and delete LeetCode questions
- **Progress Tracking**: Color-coded priority levels (Red > Orange > Yellow > Green)
- **Topic Tags**: Pre-populated 25 categories with custom topic support
- **Hints System**: Three hints per question with toggle visibility
- **Search & Filter**: Search by title, filter by progress and topic
- **GitHub Gist Sync**: Automatic real-time backup to private GitHub Gists
- **Dark Mode**: Toggle between light and dark themes
- **JSON Export**: Download data as JSON file

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Shadcn UI** component library
- **Tailwind CSS** for styling
- **Huge Icons** for icons
- **GitHub Gist API** for cloud backup
- **Zod** for data validation

## Live Demo

📱 **[https://ananth864.github.io/Leetcode_Tracker/](https://ananth864.github.io/Leetcode_Tracker/)**

## Getting Started

### Prerequisites

- Bun (recommended) or Node.js
- A GitHub account with a personal access token

### Installation

```bash
# Clone the repository
git clone https://github.com/Ananth864/Leetcode_Tracker.git
cd Leetcode_Tracker

# Install dependencies
bun install

# Run development server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### Building for Production

```bash
bun run build
```

## Configuration

### GitHub Token

Create a GitHub personal access token with `gist` scope and add it to:
- **Development**: `.env` file as `VITE_GITHUB_TOKEN=your_token`
- **Production**: GitHub repository secrets

### Deployment

The app is automatically deployed to GitHub Pages on push to `main` branch.

## Usage

1. **Add Question**: Click "Add Question" button
2. **Enter Details**: Paste LeetCode URL (title auto-extracts)
3. **Set Progress**: Choose priority level
4. **Add Topics**: Select from pre-populated or create new
5. **Add Hints**: Optional hints for later reference

### Progress Colors

- 🔴 **Red**: High priority (revisit soon)
- 🟠 **Orange**: Medium priority (revisit later)
- 🟡 **Yellow**: Low priority (eventually)
- 🟢 **Green**: Done (no revisit needed)

## Data Sync

Questions are automatically synced to a private GitHub Gist every 500ms after changes. You can also:
- **Manual Backup**: Click "Backup to Gist" in sync menu
- **Export JSON**: Click "Export as JSON" to download local copy

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   ├── QuestionTable.tsx
│   ├── AddQuestionModal.tsx
│   └── ...
├── context/            # React Context for state
├── lib/                # Utilities and API clients
├── types/              # TypeScript definitions
├── data/               # Static data (topics)
└── App.tsx            # Main application
```

## License

MIT
