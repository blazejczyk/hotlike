import { useCallback } from 'react';
import { ScrollView, View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Modal, Card, Text, Button } from '@ui-kitten/components';

type TPrivacyPolicyModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function PrivacyPolicyModal({ visible, onClose }: TPrivacyPolicyModalProps): JSX.Element {
  return (
    <Modal visible={visible} style={styles.modal} backdropStyle={styles.backdrop}>
      <Card style={styles.card}>
        <ScrollView>
          <Pressable>
            <View>
              <Text category="h6" style={styles.header}>Privacy policy</Text>
              <Text category="p2">
                {/* todo: privacy policy content  */}
                ... privacy policy content ...
              </Text>
            </View>
          </Pressable>
        </ScrollView>
        <Button status="basic" style={styles.button} onPress={onClose}>
          CLOSE
        </Button>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: '100%',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    height: Dimensions.get('window').height - 40,
    marginHorizontal: 20,
    padding: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 12,
  },
});
