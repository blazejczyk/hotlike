import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Button, Icon, Spinner } from '@ui-kitten/components';
import * as Linking from 'expo-linking';

import PhotosView from '../../../../components/PhotosView';
import { TAuthedUser } from '../../../../repos/auth';
import useAuthedUserLoader from '../../../../hooks/loaders/useAuthedUserLoader';
import useConstantsLoader from '../../../../hooks/loaders/useConstantsLoader';
import useSaver from '../../../../hooks/useSaver';
import { createPhoto, updatePhoto, deletePhoto } from '../../../../repos/photos';
import LoadingError from '../../../../components/LoadingError';
import Loading from '../../../../components/Loading';
import { getImageFile } from '../../../../services/images';
import useToast from '../../../../hooks/useToast';
import { PermissionError } from '../../../../services/exceptions';

type TPhotosTabProps = {
  user: TAuthedUser
};

export default function PhotosTab({ user }: TPhotosTabProps): JSX.Element | null {
  const toast = useToast();
  const [uploadForbidden, setUploadForbidden] = useState<boolean>(false);
  const { load: reloadAuthedUser } = useAuthedUserLoader();
  const { result: constants, loading: loadingConstants, error: constantsLoadingError, load: reloadConstants } = useConstantsLoader();

  const { save: setDefaultPhoto, loading: settingDefaultPhoto } = useSaver(async (photoId: string) => {
    await updatePhoto(photoId, { isDefault: true });
    reloadAuthedUser();
  });

  const { save: saveDeletePhoto, loading: deletingPhoto } = useSaver(async (photoId: string) => {
    await deletePhoto(photoId);
    reloadAuthedUser();
  });

  const { save: saveCreatePhoto, loading: creatingPhoto } = useSaver(async (file: string, replacedPhotoId?: string) => {
    await createPhoto(file, replacedPhotoId);
    reloadAuthedUser();
  });

  const renderUploadButtonIcon = useCallback(() => (
    creatingPhoto
      ? <Spinner size="tiny" />
      : <Icon name="plus" fill="white" style={styles.uploadButtonIcon} />
  ), [creatingPhoto]);

  const uploadPhoto = useCallback(async (replacedPhotoId?: string) => {
    if (!constants) {
      return;
    }
    const { width, height } = constants.photos.image.dimension;
    try {
      const file = await getImageFile(width, height);
      setUploadForbidden(false);
      if (file) {
        saveCreatePhoto(file, replacedPhotoId);
      }
    } catch (err) {
      if (err instanceof PermissionError) {
        setUploadForbidden(true);
      } else {
        toast('Uploading failed. Please try again.', 'danger');
      }
    }
  }, [constants, saveCreatePhoto, toast]);

  const handleCreatePhoto = useCallback(async () => {
    uploadPhoto();
  }, [uploadPhoto]);

  const handleReplacePhoto = useCallback(async (photoId: string) => {
    uploadPhoto(photoId);
  }, [uploadPhoto]);

  if (loadingConstants && !constants) {
    return <Loading />;
  }

  if (constantsLoadingError && !constants) {
    return <LoadingError onReload={reloadConstants} />;
  }

  return constants && (
    <PhotosView
      photos={user.photos}
      onDefaultChange={setDefaultPhoto}
      onReplace={(user.photos.length === constants.photos.minPhotosNumber) ? handleReplacePhoto : undefined}
      onDelete={(user.photos.length > constants.photos.minPhotosNumber) ? saveDeletePhoto : undefined}
      loading={settingDefaultPhoto || deletingPhoto}
    >
      <Text style={styles.primaryInfo}>Want to add new photos?</Text>
      <Text style={styles.secondaryInfo}>You can add up to <Text style={styles.importantInfo}>{constants.photos.maxPhotosNumber}</Text> photos.</Text>
      <Button
        status="info"
        accessoryLeft={renderUploadButtonIcon}
        onPress={handleCreatePhoto}
        disabled={creatingPhoto || user.photos.length === constants.photos.maxPhotosNumber}
      >
        UPLOAD
      </Button>
      {uploadForbidden && (
        <Text status="danger" style={styles.uploadForbidden} onPress={Linking.openSettings}>
          <Text status="danger" style={styles.importantInfo}>Media library</Text> access for the app is denied. Go to your phone <Text status="danger" style={styles.importantInfo}>settings</Text> and grant the permission first.
        </Text>
      )}
    </PhotosView>
  );
}

const styles = StyleSheet.create({
  primaryInfo: {
    marginBottom: 8,
  },
  secondaryInfo: {
    marginBottom: 12,
  },
  importantInfo: {
    fontWeight: 'bold',
  },
  uploadButtonIcon: {
    width: 18,
    height: 18,
  },
  uploadForbidden: {
    marginTop: 5,
    textAlign: 'center',
  },
});
