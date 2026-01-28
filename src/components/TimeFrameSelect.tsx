import { useState } from 'react';

import {
  Box,
  Text,
  useInput,
} from 'ink';

import { QuestionLine } from './QuestionLine.js';

export type TimeFrame = '1week' | '2weeks' | '1month';

interface Option {
  value: TimeFrame;
  label: string;
}

const OPTIONS: Option[] = [
  { value: '1week', label: '1 week' },
  { value: '2weeks', label: '2 weeks' },
  { value: '1month', label: '1 month' },
];

interface TimeFrameSelectProps {
  onSelect: (timeFrame: TimeFrame) => void;
}

export function TimeFrameSelect({ onSelect }: TimeFrameSelectProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((_, key) => {
    if (key.upArrow) {
      setSelectedIndex((i) => (i > 0 ? i - 1 : OPTIONS.length - 1));
    }
    if (key.downArrow) {
      setSelectedIndex((i) => (i < OPTIONS.length - 1 ? i + 1 : 0));
    }
    if (key.return) {
      onSelect(OPTIONS[selectedIndex].value);
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <QuestionLine question="What time frame would you like to fetch?" />
      </Box>

      {OPTIONS.map((option, index) => (
        <Box key={option.value} marginLeft={2}>
          <Text color={index === selectedIndex ? 'cyan' : undefined}>
            {index === selectedIndex ? '❯ ' : '  '}
            {option.label}
          </Text>
        </Box>
      ))}

      <Box marginTop={1} marginLeft={2}>
        <Text dimColor>Use arrow keys to navigate, Enter to select</Text>
      </Box>
    </Box>
  );
}
