/** @jsxImportSource @emotion/react */
import { PropsWithChildren } from 'react';
import { css } from '@emotion/react';

function List({ children }: PropsWithChildren) {
  return (
    <ul css={styles}>
      {children}
    </ul>
  );
}

type TListItemProps = {
  title?: string;
};

export function ListItem({ title, children }: PropsWithChildren<TListItemProps>) {
  return (
    <li className="list-item">
      {title && <div className={`list-item-title${children ? ' headline' : ''}`}>{title}</div>}
      {children && <div>{children}</div>}
    </li>
  );
}

const styles = css`
  list-style-type: square;
  margin: 0;
  padding: 0 0 0 20px;
  .list-item {
    &:not(:last-of-type) {
      padding-bottom: 8px;
    }
    .list-item-title {
      padding-bottom: 2px;
      &.headline {
        font-weight: bold;
      }
    }
  }
`;

export default List;
