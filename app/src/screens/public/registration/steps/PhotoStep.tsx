import { useCallback, useMemo, useState } from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { Avatar, Button, Icon, Text, useTheme } from '@ui-kitten/components';
import * as Linking from 'expo-linking';

import PublicScopeHeader from '../../../../components/PublicScopeHeader';
import ContinueButton from '../ContinueButton';
import { TRegisteredAuthedUser } from '../../../../repos/auth';
import { getImageFile } from '../../../../services/images';
import { TConstants } from '../../../../repos/constants';
import useToast from '../../../../hooks/useToast';
import { ImageSourcePropType } from 'react-native/Libraries/Image/Image';
import { PermissionError } from '../../../../services/exceptions';

const photoMargin = 50;
const photoWidth = Dimensions.get('window').width - 2 * photoMargin; // width & height of the displayed photo

type TPhotoStepProps = {
  registeredAuthedUser: TRegisteredAuthedUser;
  photosConstants: TConstants['photos'];
  onChange: (data: Partial<TRegisteredAuthedUser>) => void;
  onComplete?: () => void;
};

export default function PhotoStep({ registeredAuthedUser: { photoFile }, photosConstants, onChange, onComplete }: TPhotoStepProps): JSX.Element {
  const { width, height } = photosConstants.image.dimension;
  const theme = useTheme();
  const toast = useToast();
  const [uploadForbidden, setUploadForbidden] = useState<boolean>(false);

  const renderUploadIcon = useCallback(() => (
    <Icon name="upload-outline" fill={theme['color-info-default']} style={styles.uploadIcon} />
  ), [theme]);

  const handleUploadPhoto = useCallback(async () => {
    try {
      const file = await getImageFile(width, height);
      setUploadForbidden(false);
      if (file) {
        onChange({ photoFile: file });
      }
    } catch (err) {
      if (err instanceof PermissionError) {
        setUploadForbidden(true);
      } else {
        toast('Uploading failed. Please try again.', 'danger');
      }
    }
  }, [width, height, onChange, toast]);

  const photoSource = useMemo<ImageSourcePropType | undefined>(() => (
    photoFile
      ? { uri: `data:image/jpeg;base64,${photoFile}` }
      : undefined
  ), [photoFile]);

  const photoStyle = useMemo(() => [styles.photoImage, { height: photoWidth * height / width }], [width, height]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PublicScopeHeader
        iconName="camera"
        title="Upload photo"
        description="Please select one of your photos."
      />
      <View style={styles.photoContainer}>
        {photoFile !== '' && <Avatar source={photoSource} shape="square" style={photoStyle} />}
        <View style={styles.buttons}>
          <Button
            status="info"
            appearance="outline"
            accessoryLeft={renderUploadIcon}
            onPress={handleUploadPhoto}
          >
            {photoFile ? 'CHANGE' : 'UPLOAD'}
          </Button>
          <ContinueButton onComplete={onComplete} style={styles.continueButton} />
          {uploadForbidden && (
            <Text status="danger" style={styles.uploadForbidden} onPress={Linking.openSettings}>
              <Text status="danger" style={styles.importantInfo}>Media library</Text> access for the app is denied. Go to your phone <Text status="danger" style={styles.importantInfo}>settings</Text> and grant the permission first.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  photoContainer: {
    marginTop: 10,
    marginHorizontal: photoMargin,
  },
  photoImage: {
    width: photoWidth,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttons: {
    marginTop: 20,
  },
  uploadIcon: {
    width: 22,
    height: 22,
  },
  continueButton: {
    marginTop: 12,
  },
  importantInfo: {
    fontWeight: 'bold',
  },
  uploadForbidden: {
    marginTop: 10,
    textAlign: 'center',
  },
});
