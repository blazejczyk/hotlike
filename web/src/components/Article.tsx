/** @jsxImportSource @emotion/react */
import { PropsWithChildren } from 'react';
import { css, SerializedStyles } from '@emotion/react';

type TArticleProps = {
  title: string;
  contentCss?: SerializedStyles;
};

function Article({ title, contentCss, children }: PropsWithChildren<TArticleProps>) {
  return (
    <div css={styles}>
      <div className="header">
        <img src="/images/logo-icon.png" className="logo" />
        <h1 className="title">{title}</h1>
      </div>
      <div className="content-container" css={contentCss}>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Importance({ children }: PropsWithChildren) {
  return <span className="importance">{children}</span>;
}

const styles = css`
  padding: 0 2%;
  .header {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-wrap: wrap;
    text-align: center;
    gap: 20px;
    margin-bottom: 25px;
    .logo {
      width: 75px;
      height: auto;
    }
    .title {
      margin: 0;
      padding: 0;
      color: #e40469;
      font-size: 30px;
    }
  }
  .content-container {
    display: flex;
    justify-content: center;
    .content {
      max-width: 700px;
      font-size: 20px;
      .importance {
        font-weight: bold;
      }
    }
  }
`;

export default Article;
