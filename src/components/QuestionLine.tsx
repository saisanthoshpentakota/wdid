import { Box, Text } from 'ink';

interface QuestionLineProps {
  question: string;
  answer?: string;
}

export function QuestionLine({ question, answer }: QuestionLineProps) {
  const isAnswered = !!answer;

  return (
    <Box>
      <Text color={isAnswered ? 'green' : 'gray'}>
        {isAnswered ? '●' : '○'}
      </Text>
      <Text> {question} </Text>
      {answer && <Text color="cyan">{answer}</Text>}
    </Box>
  );
}
