/** @jsxImportSource @emotion/react */
import { BrowserRouter } from 'react-router-dom';
import { css } from '@emotion/react';

import Navigation from './Navigation';
import Content from './Content';

function App() {
  return (
    <div css={styles}>
      <BrowserRouter>
        <Content />
        <Navigation />
      </BrowserRouter>
    </div>
  );
}

const APP_PADDING = 20; // px

const styles = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  background-image: url('/images/brick.png');
  padding: ${APP_PADDING}px;
  height: calc(100% - ${2 * APP_PADDING}px);
`;

export default App;
