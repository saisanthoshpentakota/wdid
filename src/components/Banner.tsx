import { useMemo } from 'react';

import figlet from 'figlet';
import { Box, Static, Text } from 'ink';

export const BANNER_HEIGHT = figlet.textSync("wdid?", { font: "Big" }).split("\n").length + 2;

export function Banner() {
  const banner = useMemo(() => figlet.textSync("wdid?", { font: "Big" }), []);

  return (
    <Static items={[banner]}>
      {(item) => (
        <Box key="banner" marginBottom={1} paddingX={1}>
          <Text bold color="cyan">
            {item}
          </Text>
        </Box>
      )}
    </Static>
  );
}
