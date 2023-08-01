/** @jsxImportSource @emotion/react */
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';

type TListItem = {
  title: string;
  href: string;
};

function Navigation() {
  return (
    <ul css={styles}>
      {listItems.map(({ title, href }, idx) => (
        <Fragment key={idx}>
          <li>
            <Link to={href}>{title}</Link>
          </li>
          {(idx !== listItems.length - 1) && (<li> | </li>)}
        </Fragment>
      ))}
    </ul>
  );
}

const listItems: TListItem[] = [
  {
    title: 'Download',
    href: '/',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Privacy policy',
    href: '/privacy',
  },
  {
    title: 'Terms',
    href: '/terms',
  },
  {
    title: 'Partnership',
    href: '/partnership',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
];

const styles = css`
  list-style-type: none;
  margin: 20px 0 0 0;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
`;

export default Navigation;
