/** @jsxImportSource @emotion/react */
import { PropsWithChildren } from 'react';
import { css } from '@emotion/react';

type TParagraphProps = {
  header?: string;
};

function Paragraph({ header, children }: PropsWithChildren<TParagraphProps>) {
  return (
    <div css={styles} className={header ? 'with-header' : undefined}>
      {header && <h3 className="paragraph-header">{header}</h3>}
      {children}
    </div>
  );
}

const styles = css`
  margin: 0 0 20px 0;
  &.with-header {
    margin-bottom: 32px;
  }
  .paragraph-header {
    margin: 0 0 8px 0;
    padding: 0;
    font-size: 22px;
  }
`;

export default Paragraph;
