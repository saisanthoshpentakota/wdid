import { Box, Text } from 'ink';

import { PullRequest } from '../services/index.js';

interface PendingPRListProps {
  prs: PullRequest[];
}

export function PendingPRList({ prs }: PendingPRListProps) {
  if (prs.length === 0) {
    return (
      <Box>
        <Text dimColor>No pending PRs.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Pending PRs by me ({prs.length}):</Text>
      <Box flexDirection="column" marginTop={1}>
        {prs.map((pr) => (
          <Box key={`${pr.repo}-${pr.number}`}>
            <Text color="gray">{pr.repo}</Text>
            <Text color="yellow"> #{pr.number}</Text>
            <Text> {pr.title}</Text>
            {pr.draft && <Text dimColor> (draft)</Text>}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
