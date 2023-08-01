import { useEffect } from 'react';

export const defaultTitle = 'HotLike - date immediately.';
const suffix = ' | HotLike';

function useTitle(title: string, skipSuffix: boolean = false) {
  useEffect(() => {
    document.title = `${title}${skipSuffix ? '' : suffix}`;
  }, [title, skipSuffix]);
}

export default useTitle;
