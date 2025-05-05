import { Text, View, TextInput, Button, StyleSheet, FlatList} from "react-native";
import React, {useState} from 'react';

class Profile {
  id: string;
  title: string;
  username: string;
  password: string;

  constructor(id: string, title: string, username: string, password: string) {
    this.id = id;
    this.title = title;
    this.username = username;
    this.password = password;
  }
}

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userId, setUserId] = useState('1');
  const [titleInput, setTitle] = useState('');
  const [userInput, setUsername] = useState('');
  const [passwordInput, setPassword] = useState('');

  const handleCreateProfile = () => {
    const newProfile = new Profile(
      (profiles.length + 1).toString(),
      titleInput,
      userInput,
      passwordInput
    );
    setProfiles([...profiles, newProfile]);

    // Clear input fields
    setTitle('');
    setUsername('');
    setPassword('');
  };

  return (
    <View style={{ padding: 10 }}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(newText) => setUsername(newText)}
        value={userInput}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(newText) => setPassword(newText)}
        value={passwordInput}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Account Title"
        onChangeText={(newText) => setTitle(newText)}
        value={titleInput}
      />
      <Button
        onPress={() => {
          handleCreateProfile();
        }}
        disabled={userInput === '' || passwordInput === ''}
        title="Create Profile"
      />
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.profileContainer}>
            <Text style={styles.text}>Profile {index + 1}:</Text>
            <Text style={styles.text}>Title: {item.title}</Text>
            <Text style={styles.text}>Username: {item.username}</Text>
            <Text style={styles.text}>Password: {item.password}</Text>
          </View>
        )}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  profileContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
  },
});

