/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

type TDownloadButtonProps = {
  icon: string;
  storeName: string;
  onClick: () => void;
  disabled?: boolean;
};

function DownloadButton({ icon, storeName, onClick, disabled }: TDownloadButtonProps) {
  return (
    <button className="button" onClick={onClick} disabled={disabled} css={styles}>
      <img src={`/images/${icon}.png`} className="store-icon" />
      <div className="store-info">
        <div className="store-download-text">{disabled ? 'AVAILABLE SOON IN' : 'DOWNLOAD FROM'}</div>
        <div className="store-name">{storeName}</div>
      </div>
    </button>
  );
}

const styles = css`
  margin: 0;
  width: 190px;
  padding: 10px;
  font-size: 16px;
  text-align: right;
  cursor: pointer;
  border: 1px solid #8F9BB3;
  border-radius: 5px;
  background-color: #F7F9FC;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 3px 3px 5px #222B45;
  &:hover {
    border-color: #1A2138;
  }
  .store-icon {
    width: 42px;
    height: 42px;
  }
  .store-info {
    .store-download-text {
      font-size: 11px;
      margin-bottom: 3px;
    }
    .store-name {
      font-weight: bold;
    }
  }
`;

export default DownloadButton;
