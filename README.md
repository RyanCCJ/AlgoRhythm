# AlgoRhythm 🎵

A modern typing practice app for mastering algorithm templates through muscle memory.

## Features

- **Monaco Editor Integration**: Professional code editor with syntax highlighting
- **Real-time Visual Feedback**:
  - Correct characters reveal syntax highlighting
  - Incorrect characters shown in red with error background
  - Custom blinking cursor tracks your position
- **Progress Tracking**:
  - WPM and Accuracy stats on completion
  - Accuracy calculation ignores whitespace, penalizes only code characters
  - Progress persisted to localStorage
- **Color-coded Performance**:
  - 🟢 Green: 100% accuracy
  - 🟡 Yellow: 60-99% accuracy  
  - 🔴 Red: Below 60% accuracy
- **Keyboard Shortcuts**:
  - `Enter`: Proceed to next problem (after completion)
  - `Esc`: Retry current problem (after completion)
  - `Tab`: Insert 4 spaces (during typing)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Generate content from markdown files
npm run generate

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
AlgoRhythm/
├── content/               # Problem definitions
│   ├── easy/
│   │   ├── problems/      # Problem descriptions (markdown)
│   │   └── programs/      # Solution code (Python)
│   ├── medium/
│   └── hard/
├── src/
│   ├── components/        # React components
│   ├── data/              # Generated content.json
│   └── store/             # Zustand state management
└── scripts/               # Build scripts
```

## Adding Problems

1. Create a markdown file in `content/{difficulty}/problems/` (e.g., `A21.md`)
2. Create the corresponding code file in `content/{difficulty}/programs/` (e.g., `A21.py`)
3. Run `npm run generate` to update the content

### Problem Format

**Problem Description** (`content/easy/problems/A1.md`):
```markdown
# Two Sum

Given an array of integers `nums` and an integer `target`, return indices of the two numbers that add up to `target`.
```

**Solution Code** (`content/easy/programs/A1.py`):
```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Code Editor**: Monaco Editor
- **State Management**: Zustand
- **Animations**: Framer Motion + Canvas Confetti

## License

MIT
