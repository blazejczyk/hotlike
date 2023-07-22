import { PropsWithChildren, Fragment, useCallback, useMemo, useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ButtonGroup, Button, Icon } from '@ui-kitten/components';

import { TPhoto } from '../repos/photos';
import Photo from './Photo';
import useConfirm from '../hooks/useConfirm';
import usePrevious from '../hooks/usePrevious';

type TPhotosView = {
  photos: TPhoto[];
  loading?: boolean;
  onDefaultChange?: (photoId: string) => Promise<void>;
  onReplace?: (photoId: string) => Promise<void>;
  onDelete?: (photoId: string) => Promise<void>;
};

const photoMargin = 16;
const photoWidth = Dimensions.get('window').width - 2 * photoMargin; // width & height of the displayed photo
const linearGradientColors = ['white', 'rgba(255, 255, 255, 0.7)'];

export default function PhotosView({ photos, loading, onDefaultChange, onReplace, onDelete, children }: PropsWithChildren<TPhotosView>): JSX.Element {
  const [linearGradientHeight, setLinearGradientHeight] = useState<number>(0);
  const scrollView = useRef<ScrollView>(null);

  const handleLinearGradientLayout = useCallback(({ nativeEvent: { layout: { height } } }: LayoutChangeEvent) => {
    if (linearGradientHeight !== height) {
      setLinearGradientHeight(height);
    }
  }, [linearGradientHeight]);

  const handleDefaultChange = useCallback(async (photoId: string) => {
    if (onDefaultChange) {
      await onDefaultChange(photoId);
      scrollView.current?.scrollTo({ y: 0 });
    }
  }, [onDefaultChange]);

  const photosStyle = useMemo(() => [
    styles.photos,
    {
      paddingTop: linearGradientHeight + photoMargin / 2
    },
  ], [linearGradientHeight]);

  usePrevious(photos.length, (previousLength, nextLength) => {
    if (nextLength > previousLength) {
      scrollView.current?.scrollToEnd();
    }
  });

  return (
    <View style={styles.container}>
      {children && (
        <LinearGradient
          colors={linearGradientColors}
          style={styles.linearGradient}
          pointerEvents="box-none"
          onLayout={handleLinearGradientLayout}
        >
          {children}
        </LinearGradient>
      )}
      <ScrollView ref={scrollView} contentContainerStyle={photosStyle}>
        {photos.map((photo, idx) => (
          <PhotoContainer
            key={photo.id}
            {...photo}
            loading={loading}
            onDefaultChange={onDefaultChange && (idx > 0 ? handleDefaultChange : undefined)}
            onReplace={onReplace}
            onDelete={onDelete}
          />
        ))}
      </ScrollView>
    </View>
  );
}

type TPhotoContainerProps = TPhoto & {
  loading?: boolean;
  onDefaultChange?: (photoId: string) => void;
  onReplace?: (photoId: string) => void;
  onDelete?: (photoId: string) => void;
};

// todo: move this to separate file
function PhotoContainer({ id, width, height, imageUrl, loading, onDefaultChange, onReplace, onDelete }: TPhotoContainerProps): JSX.Element {
  const confirm = useConfirm();
  const style = useMemo(() => [styles.photoImage, { height: photoWidth * height / width }], [width, height]);

  const renderReplacePhotoIcon = useCallback(() => <Icon fill="white" name="swap-outline" style={styles.photoButton} />, []);
  const renderSetDefaultPhotoIcon = useCallback(() => <Icon fill="white" name="person-done" style={styles.photoButton} />, []);
  const renderDeletePhotoIcon = useCallback(() => <Icon fill="white" name="trash" style={styles.photoButton} />, []);

  const handleSetDefaultPhoto = useCallback(() => {
    if (onDefaultChange) {
      onDefaultChange(id);
    }
  }, [id, onDefaultChange]);

  const handleReplacePhoto = useCallback(() => {
    if (onReplace) {
      onReplace(id);
    }
  }, [id, onReplace]);

  const handleDeletePhoto = useCallback(() => {
    if (onDelete) {
      confirm('Are you sure you want to delete this photo?', () => onDelete(id));
    }
  }, [onDelete, confirm, id]);

  return (
    <View style={styles.photoContainer}>
      <Photo url={imageUrl} shape="square" style={style} fallback={false} />
      {(onDefaultChange || onReplace || onDelete) && (
        <ButtonGroup size="small" status="info" style={styles.photoButtons}>
          {onDefaultChange
            ? (
              <Button
                accessoryLeft={renderSetDefaultPhotoIcon}
                onPress={handleSetDefaultPhoto}
                disabled={loading}
              />
            )
            : <Fragment />
          }
          {onReplace
            ? (
              <Button
                accessoryLeft={renderReplacePhotoIcon}
                onPress={handleReplacePhoto}
                disabled={loading}
              />
            )
            : <Fragment />
          }
          {onDelete
            ? (
              <Button
                accessoryLeft={renderDeletePhotoIcon}
                onPress={handleDeletePhoto}
                disabled={loading}
              />
            )
            : <Fragment />
          }
        </ButtonGroup>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  linearGradient: {
    alignItems: 'center',
    padding: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  photos: {
    paddingBottom: photoMargin / 2,
    alignItems: 'center',
  },
  photoContainer: {
    // marginTop: photoMargin / 2,
    // marginBottom: photoMargin / 2,
    marginVertical: photoMargin / 2,
    position: 'relative',
  },
  photoImage: {
    width: photoWidth,
    borderRadius: 8,
    borderWidth: 1,
  },
  photoButtons: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  photoButton: {
    width: 20,
    height: 20,
  },
});
