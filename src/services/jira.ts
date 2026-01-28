import 'dotenv/config';

export interface JiraIssue {
  key: string;
  summary: string;
  statusChangeDate?: string;
}

interface JiraApiResponse {
  key: string;
  fields: {
    summary: string;
    statuscategorychangedate?: string;
  };
}

interface JiraSearchResponse {
  issues: JiraApiResponse[];
}

export function getJiraConfig() {
  return {
    host: process.env.JIRA_HOST || '',
    email: process.env.JIRA_EMAIL || '',
    token: process.env.JIRA_API_TOKEN || '',
  };
}

function getAuthHeaders(): Record<string, string> {
  const { email, token } = getJiraConfig();
  const auth = Buffer.from(`${email}:${token}`).toString('base64');
  return {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
  };
}

export async function fetchJiraIssue(ticketId: string): Promise<JiraIssue | null> {
  const { host, email, token } = getJiraConfig();

  if (!host || !email || !token) {
    return null;
  }

  const url = `https://${host}/rest/api/3/issue/${ticketId}?fields=summary`;

  try {
    const response = await fetch(url, { headers: getAuthHeaders() });

    if (!response.ok) {
      return null;
    }

    const data: JiraApiResponse = await response.json();

    return {
      key: data.key,
      summary: data.fields.summary,
    };
  } catch {
    return null;
  }
}

export async function fetchJiraIssues(ticketIds: string[]): Promise<Map<string, JiraIssue>> {
  const results = new Map<string, JiraIssue>();

  const promises = ticketIds.map(async (id) => {
    const issue = await fetchJiraIssue(id);
    if (issue) {
      results.set(id, issue);
    }
  });

  await Promise.all(promises);

  return results;
}

export async function fetchAssignedInProgressIssues(): Promise<JiraIssue[]> {
  const { host, email, token } = getJiraConfig();

  if (!host || !email || !token) {
    return [];
  }

  const jql = `assignee = "${email}" AND status = "In Progress" ORDER BY updated DESC`;
  const url = `https://${host}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&fields=summary,status,statuscategorychangedate&maxResults=50`;

  try {
    const response = await fetch(url, { headers: getAuthHeaders() });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Jira API error:', response.status, errorText);
      return [];
    }

    const data: JiraSearchResponse = await response.json();

    return data.issues.map((issue) => ({
      key: issue.key,
      summary: issue.fields.summary,
      statusChangeDate: issue.fields.statuscategorychangedate,
    }));
  } catch (err) {
    console.error('Jira fetch error:', err);
    return [];
  }
}
