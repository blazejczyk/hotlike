import { useEffect, useMemo } from 'react';
import { ImageSourcePropType } from 'react-native/Libraries/Image/Image';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ImageStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { Avatar } from '@ui-kitten/components';
import { EvaSize } from '@ui-kitten/components/devsupport';

import useCaller from '../hooks/useCaller';
import { getAuthorizationHeaders } from '../core/api';

type TPhotoProps = {
  url: string;
  shape?: 'round' | 'rounded' | 'square';
  size?: EvaSize;
  style?: StyleProp<ImageStyle>; // style can override shape & size props and this is obviously expected
  fallback?: boolean | string; // if string then it's a path to the fallback file
};

export default function Photo({ url, shape, size, style, fallback = true }: TPhotoProps): JSX.Element {
  const { result: photoContent, error, call } = useCaller((url: string) => getPhotoContent(url));

  useEffect(() => {
    call(url);
  }, [call, url]);

  const source = useMemo<ImageSourcePropType | undefined>(() => {
    if (photoContent) {
      return { uri: photoContent };
    }
    if (error) {
      return fallback
        ? (fallback === true ? require('../../assets/images/photo-fallback.png') : fallback)
        : undefined;
    }
  }, [photoContent, error, fallback]);

  return (
    <Avatar
      source={source}
      shape={shape || 'round'}
      size={size || 'medium'}
      style={style}
    />
  );
}

async function getPhotoContent(url: string): Promise<string> {
  const authorizationHeaders = await getAuthorizationHeaders();
  const response = await fetch(url, { headers: authorizationHeaders });
  const blob = await response.blob();
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
  });
}
