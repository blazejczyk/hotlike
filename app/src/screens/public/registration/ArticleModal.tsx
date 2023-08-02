import { PropsWithChildren } from 'react';
import { ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Modal, Card, Text, Button } from '@ui-kitten/components';

type TArticleModalProps = {
  title: string;
  visible: boolean;
  onClose: () => void;
};

export default function ArticleModal({ title, visible, onClose, children }: PropsWithChildren<TArticleModalProps>): JSX.Element {
  return (
    <Modal visible={visible} style={styles.modal} backdropStyle={styles.backdrop}>
      <Card style={styles.card}>
        <ScrollView>
          <Pressable>
            <Text category="h6" style={styles.header}>{title}</Text>
            {children}
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
    marginBottom: 10,
  },
  button: {
    marginTop: 12,
  },
});
