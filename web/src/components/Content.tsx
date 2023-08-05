/** @jsxImportSource @emotion/react */
import { useRef, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { css } from '@emotion/react';

import Download from '../routes/Download';
import About from '../routes/About';
import PrivacyPolicy from '../routes/PrivacyPolicy';
import AccountDeletion from '../routes/AccountDeletion';
import Terms from '../routes/Terms';
import Partnership from '../routes/Partnership';
import Contact from '../routes/Contact';

function Content() {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    ref.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div ref={ref} css={styles}>
      <Routes>
        <Route path="/" Component={Download} />
        <Route path="/about" Component={About} />
        <Route path="/privacy" Component={PrivacyPolicy} />
        <Route path="/deletion" Component={AccountDeletion} />
        <Route path="/terms" Component={Terms} />
        <Route path="/partnership" Component={Partnership} />
        <Route path="/contact" Component={Contact} />
      </Routes>
    </div>
  );
}

const styles = css`
  overflow: auto;
  flex: auto;
`;

export default Content;
