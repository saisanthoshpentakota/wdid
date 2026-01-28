import { Box, Text } from 'ink';

import { Commit } from '../services/index.js';

interface CommitListProps {
  commits: Commit[];
}

export function CommitList({ commits }: CommitListProps) {
  if (commits.length === 0) {
    return (
      <Box>
        <Text color="yellow">No commits found. Did you even work?</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="green">Found {commits.length} commits:</Text>
      {commits.map((commit) => (
        <Box key={commit.sha} flexDirection="column">
          <Box>
            <Text color="cyan">{commit.repo}</Text>
            <Text dimColor> • </Text>
            <Text dimColor>{commit.sha.slice(0, 7)}</Text>
          </Box>
          <Box marginLeft={2}>
            <Text>{commit.message}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
