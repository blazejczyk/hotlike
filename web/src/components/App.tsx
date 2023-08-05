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

const styles = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  background-image: url('/images/brick.png');
  padding: 0 20px;
  height: 100%;
`;

export default App;
