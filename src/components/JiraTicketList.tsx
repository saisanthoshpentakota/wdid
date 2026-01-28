import { Box, Text } from 'ink';

import { JiraTicket } from '../utils/index.js';
import { JiraIssue } from '../services/index.js';

interface JiraTicketListProps {
  tickets: JiraTicket[];
  jiraIssues: Map<string, JiraIssue>;
}

export function JiraTicketList({ tickets, jiraIssues }: JiraTicketListProps) {
  if (tickets.length === 0) {
    return (
      <Box>
        <Text dimColor>No Jira tickets found in commits.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold color="magenta">Found {tickets.length} Jira tickets:</Text>
      <Box flexDirection="column" marginTop={1}>
        {tickets.map((ticket) => {
          const issue = jiraIssues.get(ticket.id);
          return (
            <Box key={ticket.id}>
              <Text color="yellow">{ticket.id}</Text>
              <Text> </Text>
              {issue ? (
                <Text>{issue.summary}</Text>
              ) : (
                <Text dimColor>({ticket.commits.length} commit{ticket.commits.length > 1 ? 's' : ''})</Text>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
