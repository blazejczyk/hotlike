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
    <div css={styles}>
      <ul className="list">
        {listItems.map(({ title, href }, idx) => (
          <Fragment key={idx}>
            <li>
              <Link to={href}>{title}</Link>
            </li>
            {(idx !== listItems.length - 1) && (<li> | </li>)}
          </Fragment>
        ))}
      </ul>
      <div className="copyrights">
        &copy; 2023 HotLike by Eryk Blazejczyk. All rights reserved.
      </div>
    </div>
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
  .list {
    list-style-type: none;
    margin: 0;
    padding: 0 20px;
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .copyrights {
    text-align: center;
    padding: 10px 0;
    font-size: 12px;
  }
`;

export default Navigation;
