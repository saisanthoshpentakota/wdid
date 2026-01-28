import { useState, useEffect } from 'react';

import {
  Box,
  useApp,
  useInput,
  useStdout,
} from 'ink';

import {
  Banner,
  BANNER_HEIGHT,
  CommitList,
  LoadingMessages,
  QuestionLine,
  TimeFrame,
  TimeFrameSelect,
} from './components/index.js';
import { fetchCommits, getAuthor, Commit } from './services/index.js';

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
  const { stdout } = useStdout();
  const [screen, setScreen] = useState<Screen>('timeframe');
  const [timeFrame, setTimeFrame] = useState<TimeFrame | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);

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

    fetchCommits({
      author: getAuthor(),
      since,
      until,
    }).then((result) => {
      setCommits(result);
      setScreen('results');
    });
  }, [screen, timeFrame]);

  return (
    <>
      <Banner />

      <Box flexDirection="column" height={stdout.rows - BANNER_HEIGHT} paddingX={1}>
        {screen === 'timeframe' ? (
          <TimeFrameSelect onSelect={handleTimeFrameSelect} />
        ) : (
          <>
            <QuestionLine
              question={QUESTIONS.timeFrame}
              answer={timeFrame ? TIME_FRAME_LABELS[timeFrame] : undefined}
            />
            <Box marginTop={1}>
              {screen === 'loading' ? (
                <LoadingMessages />
              ) : (
                <CommitList commits={commits} />
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
