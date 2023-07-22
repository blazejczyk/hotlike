import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import { PermissionError } from './exceptions';

export async function getImageFile(width: number, height: number): Promise<string | void> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new PermissionError('Media library access denied.')
  }

  const { canceled, assets } = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
  if (canceled) {
    return;
  }

  const { base64: file } = await ImageManipulator.manipulateAsync(
    assets[0].uri,
    [{ resize: { width, height } }],
    { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  );
  return file;
}
