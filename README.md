# wdid? (What Did I Do?)

For when you forget what you did 5 minutes ago.

A terminal UI tool that helps you remember what you actually worked on. It fetches your git commits and Jira tickets to give you a quick summary of your work — perfect for standups, timesheets, seflreviews.

## Features

- Fetches git commits from configured repositories
- Groups commits by Jira ticket
- Shows assigned in-progress Jira tickets
- Displays commit frequency chart
- Calculates average commits per working day (Mon-Fri)
- Supports 1 week, 2 weeks, or 1 month timeframes

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your configuration (see `.env.example`):

```bash
cp .env.example .env
```

3. Build the project:

```bash
npm run build
```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## Global Installation

To use `wdid` from anywhere on your system:

### Option 1: npm link (recommended for development)

```bash
npm run build
npm link
```

Now you can run `wdid` from any directory.

To unlink:

```bash
npm unlink -g wdid
```

### Option 2: Install globally

```bash
npm run build
npm install -g .
```

To uninstall:

```bash
npm uninstall -g wdid
```

## Configuration

Create a `.env` file with the following variables:

| Variable | Description |
|----------|-------------|
| `GITHUB_AUTHOR` | Your github username for filtering commits |
| `GITHUB_TOKEN` | Your github token with access to repos |
| `JIRA_HOST` | Your Workspace's jira host |
| `JIRA_EMAIL` | Your Jira email |
| `JIRA_API_TOKEN` | Your Jira API token |

## Controls

- **Arrow keys**: Navigate options
- **Enter**: Select
- **ctrl+c**: Exit
