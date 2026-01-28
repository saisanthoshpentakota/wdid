import { Box, Text, useStdout } from 'ink';
import TextInput from 'ink-text-input';

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
}

export function InputBar({ value, onChange, onSubmit, placeholder }: InputBarProps) {
  const { stdout } = useStdout();
  const lineWidth = stdout.columns - 4;

  return (
    <Box flexDirection="column" paddingX={1} paddingBottom={1}>
      <Text dimColor>{"─".repeat(lineWidth)}</Text>
      <Box paddingY={0}>
        <Text color="green">{"> "}</Text>
        <TextInput
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder={placeholder}
        />
      </Box>
      <Text dimColor>{"─".repeat(lineWidth)}</Text>
    </Box>
  );
}
