import { Box, Text } from 'ink';

import { JiraIssue } from '../services/index.js';

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
        {tickets.map((ticket) => (
          <Box key={ticket.key}>
            <Text color="yellow">{ticket.key}</Text>
            <Text> {ticket.summary}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
