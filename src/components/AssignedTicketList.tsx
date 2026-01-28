import { Box, Text } from 'ink';

import { JiraIssue } from '../services/index.js';

function formatDuration(dateString?: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return '<1d';
  if (diffDays < 30) return `${diffDays}d`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}mo`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years}y`;
}

interface AssignedTicketListProps {
  tickets: JiraIssue[];
}

export function AssignedTicketList({ tickets }: AssignedTicketListProps) {
  if (tickets.length === 0) {
    return (
      <Box>
        <Text dimColor>No in-progress tickets assigned to you.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold color="blue">In Progress ({tickets.length} tickets):</Text>
      <Box flexDirection="column" marginTop={1}>
        {tickets.map((ticket) => {
          const duration = formatDuration(ticket.statusChangeDate);
          return (
            <Box key={ticket.key}>
              <Text color="yellow">{ticket.key}</Text>
              {duration && <Text color="gray"> ({duration})</Text>}
              <Text> {ticket.summary}</Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
