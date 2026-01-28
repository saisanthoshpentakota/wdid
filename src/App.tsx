import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Box,
  Text,
  useApp,
  useInput,
} from 'ink';

import {
  AssignedTicketList,
  Banner,
  CommitAnalytics,
  CommitList,
  JiraTicketList,
  LoadingMessages,
  QuestionLine,
  TimeFrame,
  TimeFrameSelect,
} from './components/index.js';
import {
  Commit,
  fetchAssignedInProgressIssues,
  fetchCommits,
  fetchJiraIssues,
  getAuthor,
  JiraIssue,
} from './services/index.js';
import {
  countWorkingDays,
  groupCommitsByDay,
  groupCommitsByTicket,
} from './utils/index.js';

const TIME_FRAME_LABELS: Record<TimeFrame, string> = {
  '1week': '1 week',
  '2weeks': '2 weeks',
  '1month': '1 month',
};

const TIME_FRAME_DAYS: Record<TimeFrame, number> = {
  '1week': 7,
  '2weeks': 14,
  '1month': 30,
};

const QUESTIONS = {
  timeFrame: 'What time frame would you like to fetch?',
};

type Screen = 'timeframe' | 'loading' | 'results';

export default function App() {
  const { exit } = useApp();
  const [screen, setScreen] = useState<Screen>('timeframe');
  const [timeFrame, setTimeFrame] = useState<TimeFrame | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [jiraIssues, setJiraIssues] = useState<Map<string, JiraIssue>>(new Map());
  const [assignedTickets, setAssignedTickets] = useState<JiraIssue[]>([]);
  const [dateRange, setDateRange] = useState<{ since: Date; until: Date } | null>(null);

  const jiraTickets = useMemo(() => groupCommitsByTicket(commits), [commits]);

  const analyticsData = useMemo(() => {
    const workingDays = dateRange ? countWorkingDays(dateRange.since, dateRange.until) : 0;
    return {
      data: groupCommitsByDay(commits),
      title: 'Commits per day:',
      totalCommits: commits.length,
      workingDays,
    };
  }, [commits, dateRange]);

  useInput((_, key) => {
    if (key.escape) {
      exit();
    }
  });

  const handleTimeFrameSelect = (selected: TimeFrame) => {
    setTimeFrame(selected);
    setScreen('loading');
  };

  useEffect(() => {
    if (screen !== 'loading' || !timeFrame) return;

    const days = TIME_FRAME_DAYS[timeFrame];
    const until = new Date();
    const since = new Date();
    since.setDate(since.getDate() - days);
    setDateRange({ since, until });

    Promise.all([
      fetchCommits({ author: getAuthor(), since, until }),
      fetchAssignedInProgressIssues(),
    ]).then(async ([commitsResult, assignedResult]) => {
      setCommits(commitsResult);
      setAssignedTickets(assignedResult);

      const tickets = groupCommitsByTicket(commitsResult);
      const ticketIds = tickets.map((t) => t.id);
      const issues = await fetchJiraIssues(ticketIds);
      setJiraIssues(issues);

      setScreen('results');
    });
  }, [screen, timeFrame]);

  return (
    <>
      <Banner />

      <Box flexDirection="column" paddingX={1}>
        {screen === 'timeframe' ? (
          <TimeFrameSelect onSelect={handleTimeFrameSelect} />
        ) : (
          <>
            <QuestionLine
              question={QUESTIONS.timeFrame}
              answer={timeFrame ? TIME_FRAME_LABELS[timeFrame] : undefined}
            />
            <Box marginTop={1} flexDirection="column" gap={1}>
              {screen === 'loading' ? (
                <LoadingMessages />
              ) : (
                <>
                  <CommitList commits={commits} />
                  <Box marginTop={1}>
                    <JiraTicketList tickets={jiraTickets} jiraIssues={jiraIssues} />
                  </Box>
                  <Box marginTop={1}>
                    <AssignedTicketList tickets={assignedTickets} />
                  </Box>
                  <Box marginTop={1}>
                    <CommitAnalytics
                      data={analyticsData.data}
                      title={analyticsData.title}
                      totalCommits={analyticsData.totalCommits}
                      workingDays={analyticsData.workingDays}
                    />
                  </Box>
                </>
              )}
            </Box>
          </>
        )}
      </Box>

      <Box paddingX={1} marginTop={1}>
        <Text dimColor>ctrl+c to exit</Text>
      </Box>
    </>
  );
}
