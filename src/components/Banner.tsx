import { useMemo } from 'react';

import figlet from 'figlet';
import { Box, Static, Text } from 'ink';

export const BANNER_HEIGHT = figlet.textSync("wdid?", { font: "Big" }).split("\n").length + 3;

export function Banner() {
  const banner = useMemo(() => figlet.textSync("wdid?", { font: "Big" }), []);

  return (
    <Static items={[banner]}>
      {(item) => (
        <Box key="banner" flexDirection="column" marginBottom={1} paddingX={1}>
          <Text bold color="cyan">
            {item}
          </Text>
          <Text color="cyan">What Did I Do? For when you forget what you did 5 minutes ago.</Text>
        </Box>
      )}
    </Static>
  );
}
