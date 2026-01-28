import { useState, useEffect } from 'react';

import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

const MESSAGES = [
  "Checking if you actually did anything...",
  "Searching for evidence of productivity...",
  "Did you work or just attend meetings?",
  "Looking for commits... any commits...",
  "Verifying you weren't just on Slack all day...",
  "Scanning for signs of life in your IDE...",
  "Hoping you didn't just move Jira tickets around...",
  "Checking if 'thinking about code' counts as work...",
  "Looking for proof you touched a keyboard...",
  "Investigating suspicious coffee break patterns...",
];

export function LoadingMessages() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Text color="yellow">
        <Spinner type="dots" />
      </Text>
      <Text> {MESSAGES[messageIndex]}</Text>
    </Box>
  );
}
