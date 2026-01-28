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
    <Box flexDirection="column">
      <Text bold color="green">Found {commits.length} commits:</Text>
      <Box flexDirection="column" marginTop={1}>
        {commits.map((commit) => (
          <Box key={commit.sha}>
            <Text>{commit.message}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
