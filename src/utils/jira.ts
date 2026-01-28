export interface JiraTicket {
  id: string;
  commits: string[];
}

const JIRA_TICKET_REGEX = /^([A-Z]+-\d+)/;

export function extractJiraTicket(message: string): string | null {
  const match = message.match(JIRA_TICKET_REGEX);
  return match ? match[1] : null;
}

export function groupCommitsByTicket(
  commits: { sha: string; message: string }[]
): JiraTicket[] {
  const ticketMap = new Map<string, string[]>();

  for (const commit of commits) {
    const ticketId = extractJiraTicket(commit.message);
    if (ticketId) {
      const existing = ticketMap.get(ticketId) || [];
      existing.push(commit.message);
      ticketMap.set(ticketId, existing);
    }
  }

  return Array.from(ticketMap.entries()).map(([id, commitMessages]) => ({
    id,
    commits: commitMessages,
  }));
}
