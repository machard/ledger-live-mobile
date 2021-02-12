// @flow

import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  size: number,
  color: string,
};

export default ({ size = 16, color }: Props) => (
  <Svg height={size} width={size} viewBox="0 0 12 14">
    <Path
      d="M5.99987 0.79541C4.07942 0.79541 2.52259 2.35224 2.52259 4.27268V5.16268C1.60906 5.22123 0.88623 5.98072 0.88623 6.90905V11.4545C0.88623 12.421 1.66973 13.2045 2.63623 13.2045H9.3635C10.33 13.2045 11.1135 12.421 11.1135 11.4545V6.90905C11.1135 5.98072 10.3907 5.22123 9.47714 5.16268V4.27268C9.47714 2.35224 7.92031 0.79541 5.99987 0.79541ZM9.3635 6.65905H8.72714H3.27259H2.63623C2.49816 6.65905 2.38623 6.77098 2.38623 6.90905V11.4545C2.38623 11.5926 2.49816 11.7045 2.63623 11.7045H9.3635C9.50157 11.7045 9.6135 11.5926 9.6135 11.4545V6.90905C9.6135 6.77098 9.50157 6.65905 9.3635 6.65905ZM7.97714 5.15905V4.27268C7.97714 3.18067 7.09188 2.29541 5.99987 2.29541C4.90785 2.29541 4.02259 3.18066 4.02259 4.27268V5.15905H7.97714Z"
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);