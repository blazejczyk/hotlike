/** @jsxImportSource @emotion/react */
import { useCallback } from 'react';
import { css } from '@emotion/react';

import DownloadButton from '../components/DownloadButton';
import useTitle, { defaultTitle } from '../hooks/useTitle';

function Download() {
  useTitle(defaultTitle, true);

  const handleAndroidDownload = useCallback(() => {
    console.log('handle android download');
  }, []);

  const handleIosDownload = useCallback(() => {
    console.log('handle ios download');
  }, []);

  return (
    <div css={styles}>
      <img src="/images/logo.png" className="logo" />
      <div className="slogan">
        <div className="info">
          Meet people in <span className="crucial">real life</span> doing what you really like.
        </div>
        <div>
          No swipes. No chats. Just real <span className="crucial">meetings</span>. Immediately.
        </div>
      </div>
      <div className="buttons">
        <DownloadButton icon="android" storeName="GOOGLE PLAY" onClick={handleAndroidDownload} disabled />
        <DownloadButton icon="ios" storeName="APP STORE" onClick={handleIosDownload} disabled />
      </div>
    </div>
  );
}

const styles = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  .logo {
    width: 190px;
    height: auto;
  }
  .slogan {
    margin: 30px 0;
    padding: 0 10px;
    font-size: 22px;
    text-align: center;
    .info {
      margin-bottom: 15px;
    }
  }
  .crucial {
    color: #e40469;
  }
  .buttons {
    display: flex;
    justify-content: center;
    gap: 18px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
`;

export default Download;
