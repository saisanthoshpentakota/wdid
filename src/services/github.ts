import 'dotenv/config';

export interface Commit {
  sha: string;
  message: string;
  date: string;
  repo: string;
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
