import 'dotenv/config';

export interface Commit {
  sha: string;
  message: string;
  date: string;
  repo: string;
}

export interface PullRequest {
  number: number;
  title: string;
  repo: string;
  url: string;
  createdAt: string;
  draft: boolean;
}

export interface FetchCommitsOptions {
  author: string;
  since: Date;
  until: Date;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubCommitItem[];
}

interface GitHubCommitItem {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
  repository: {
    full_name: string;
  };
}

interface GitHubIssueSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssueItem[];
}

interface GitHubIssueItem {
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  draft?: boolean;
  repository_url: string;
}

export function getAuthor(): string {
  return process.env.GITHUB_AUTHOR || 'unknown';
}

export function getToken(): string | undefined {
  return process.env.GITHUB_TOKEN;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export async function fetchCommits(options: FetchCommitsOptions): Promise<Commit[]> {
  const { author, since, until } = options;
  const token = getToken();

  const query = `author:${author} committer-date:${formatDate(since)}..${formatDate(until)}`;
  const url = `https://api.github.com/search/commits?q=${encodeURIComponent(query)}&sort=committer-date&order=desc&per_page=100`;

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data: GitHubSearchResponse = await response.json();

  return data.items.map((item) => ({
    sha: item.sha,
    message: item.commit.message.split('\n')[0],
    date: item.commit.author.date,
    repo: item.repository.full_name,
  }));
}

function extractRepoFromUrl(repositoryUrl: string): string {
  // repositoryUrl is like "https://api.github.com/repos/owner/repo"
  const parts = repositoryUrl.split('/');
  return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
}

export async function fetchPendingPRsByMe(): Promise<PullRequest[]> {
  const author = getAuthor();
  const token = getToken();

  const query = `author:${author} type:pr state:open`;
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&per_page=100`;

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data: GitHubIssueSearchResponse = await response.json();

  return data.items.map((item) => ({
    number: item.number,
    title: item.title,
    repo: extractRepoFromUrl(item.repository_url),
    url: item.html_url,
    createdAt: item.created_at,
    draft: item.draft ?? false,
  }));
}

