import { useState } from 'react';

import { Box, useApp, useInput, useStdout } from 'ink';

import { Banner, BANNER_HEIGHT, QuestionLine, TimeFrameSelect, TimeFrame } from './components/index.js';

const TIME_FRAME_LABELS: Record<TimeFrame, string> = {
  '1week': '1 week',
  '2weeks': '2 weeks',
  '1month': '1 month',
};

const QUESTIONS = {
  timeFrame: 'What time frame would you like to fetch?',
};

type Screen = 'timeframe' | 'main';

export default function App() {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const [screen, setScreen] = useState<Screen>('timeframe');
  const [timeFrame, setTimeFrame] = useState<TimeFrame | null>(null);

  useInput((_, key) => {
    if (key.escape) {
      exit();
    }
  });

  const handleTimeFrameSelect = (selected: TimeFrame) => {
    setTimeFrame(selected);
    setScreen('main');
  };

  return (
    <>
      <Banner />

      <Box flexDirection="column" height={stdout.rows - BANNER_HEIGHT} paddingX={1}>
        {screen === 'timeframe' ? (
          <TimeFrameSelect onSelect={handleTimeFrameSelect} />
        ) : (
          <QuestionLine
            question={QUESTIONS.timeFrame}
            answer={timeFrame ? TIME_FRAME_LABELS[timeFrame] : undefined}
          />
        )}
      </Box>
    </>
  );
}
