import { Box, Text } from 'ink';

import { DayCommitCount } from '../utils/index.js';

interface CommitAnalyticsProps {
  data: DayCommitCount[];
  title: string;
  totalCommits: number;
  workingDays: number;
}

const BAR_CHARS = ['▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];
const MAX_BAR_WIDTH = 30;

function renderBar(count: number, maxCount: number): string {
  if (maxCount === 0) return '';
  const ratio = count / maxCount;
  const fullBlocks = Math.floor(ratio * MAX_BAR_WIDTH);
  const remainder = (ratio * MAX_BAR_WIDTH) - fullBlocks;
  const partialBlock = remainder > 0 ? BAR_CHARS[Math.floor(remainder * 8)] : '';
  return '█'.repeat(fullBlocks) + partialBlock;
}

export function CommitAnalytics({ data, title, totalCommits, workingDays }: CommitAnalyticsProps) {
  if (data.length === 0) {
    return null;
  }

  const maxCount = Math.max(...data.map((d) => d.count));
  const dateWidth = 14;
  const avgPerDay = workingDays > 0 ? (totalCommits / workingDays).toFixed(1) : '0';

  return (
    <Box flexDirection="column">
      <Text bold color="white">{title}</Text>
      <Box flexDirection="column" marginTop={1}>
        {data.map((item) => (
          <Box key={item.date}>
            <Text dimColor>{item.date.padEnd(dateWidth)}</Text>
            <Text color="green">{renderBar(item.count, maxCount)}</Text>
            <Text> {item.count}</Text>
          </Box>
        ))}
      </Box>
      <Box marginTop={1}>
        <Text>Avg: </Text>
        <Text bold color="cyan">{avgPerDay}</Text>
        <Text> commits/working day ({workingDays} working days)</Text>
      </Box>
    </Box>
  );
}
