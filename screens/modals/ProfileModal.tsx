import React from "react";
import { View, TextInput, Button, Modal, StyleSheet } from "react-native";
import Profile from "../../utils/classes/Profile";

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (profile: Profile) => void;
  profile?: Profile | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  onSubmit,
  profile,
}) => {
  const [title, setTitle] = React.useState(profile?.title || "");
  const [username, setUsername] = React.useState(profile?.username || "");
  const [password, setPassword] = React.useState(profile?.password || "");

  const handleSubmit = () => {
    const newProfile = new Profile(profile?.id || "", title, username, password);
    onSubmit(newProfile);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            onChangeText={setTitle}
            value={title}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={setUsername}
            value={username}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
          />
          <Button onPress={handleSubmit} title={profile ? "Update Profile" : "Create Profile"} />
          <Button onPress={onClose} title="Back" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});

export default ProfileModal;
