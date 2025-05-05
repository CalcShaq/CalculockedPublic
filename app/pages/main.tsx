import { Text, View, TextInput, Button, FlatList, TouchableOpacity, Modal, StyleSheet, Clipboard } from "react-native";
import React, { useState, useEffect } from 'react';
import styles from "../styles/main";
import Header from "../Components/Header"; 
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import modalStyles from "../styles/modal";

// Profile class to define the structure of a profile
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

function ProfileHandler() {
  // State variables for managing profiles and UI behavior
  const [profiles, setProfiles] = useState<Profile[]>([]); // List of profiles
  const [titleInput, setTitle] = useState(''); // Input for profile title
  const [userInput, setUsername] = useState(''); // Input for username
  const [passwordInput, setPassword] = useState(''); // Input for password
  const [formVisible, setFormVisible] = useState(false); // Controls visibility of the form modal
  const [searchQuery, setSearchQuery] = useState(''); // Search query for filtering profiles
  const [confirmVisible, setConfirmVisible] = useState(false); // Controls visibility of the delete confirmation modal
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null); // Profile selected for deletion
  const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null); // Profile selected for editing
  const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({}); // State to manage password visibility for each profile
  const router = useRouter(); // Router for navigation

  // Load profiles from AsyncStorage when the component mounts
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const storedProfiles = await AsyncStorage.getItem('profiles');
        if (storedProfiles) {
          setProfiles(JSON.parse(storedProfiles));
        }
      } catch (error) {
        console.error('Failed to load profiles from storage', error);
      }
    };

    loadProfiles();
  }, []);

  // Create a new profile and save it to AsyncStorage
  const handleCreateProfile = async () => {
    const newProfile = new Profile(
      (profiles.length + 1).toString(),
      titleInput,
      userInput,
      passwordInput
    );
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);

    try {
      await AsyncStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    } catch (error) {
      console.error('Failed to save profiles to storage', error);
    }

    // Clear input fields and hide the form
    setTitle('');
    setUsername('');
    setPassword('');
    setFormVisible(false);
  };

  // Delete a profile and update AsyncStorage
  const handleDeleteProfile = async (id: string) => {
    const updatedProfiles = profiles.filter(profile => profile.id !== id);
    setProfiles(updatedProfiles);

    try {
      await AsyncStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    } catch (error) {
      console.error('Failed to save profiles to storage', error);
    }
  };

  // Show the delete confirmation modal
  const confirmDeleteProfile = (profile: Profile) => {
    setProfileToDelete(profile);
    setConfirmVisible(true);
  };

  // Confirm deletion of a profile
  const handleConfirmDelete = () => {
    if (profileToDelete) {
      handleDeleteProfile(profileToDelete.id);
      setProfileToDelete(null);
      setConfirmVisible(false);
    }
  };

  // Update an existing profile and save changes to AsyncStorage
  const handleUpdateProfile = async () => {
    if (profileToEdit) {
      const updatedProfiles = profiles.map(profile =>
        profile.id === profileToEdit.id ? profileToEdit : profile
      );
      setProfiles(updatedProfiles);

      try {
        await AsyncStorage.setItem('profiles', JSON.stringify(updatedProfiles));
      } catch (error) {
        console.error('Failed to save profiles to storage', error);
      }

      setProfileToEdit(null); // Clear the profile being edited
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    alert('Copied to clipboard');
  };

  // Filter profiles based on the search query
  const filteredProfiles = profiles.filter(profile =>
    profile.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header with navigation buttons */}
      <Header title="Profile Manager">
        <TouchableOpacity
          onPress={() => {
            console.log("Lock App pressed");
            router.push("./Calculator");
          }}
        >
          <Text>Lock App</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log("Settings pressed");
            router.replace("./settings");
          }}
        >
          <Text>Settings</Text>
        </TouchableOpacity>
      </Header>

      {/* Search bar for filtering profiles */}
      <TextInput
        style={modalStyles.searchBar}
        placeholder="Search Profiles"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />

      {/* Modal for creating a new profile */}
      <Modal
        transparent
        visible={formVisible}
        animationType="fade"
        onRequestClose={() => setFormVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              onChangeText={(newText) => setTitle(newText)}
              value={titleInput}
            />
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
            />
            <Button
              onPress={handleCreateProfile}
              disabled={userInput === '' || passwordInput === ''}
              title="Create Profile"
            />
            <Button
              onPress={() => setFormVisible(false)}
              title="Back"
            />
          </View>
        </View>
      </Modal>

      {/* Modal for confirming profile deletion */}
      <Modal
        transparent
        visible={confirmVisible}
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContainer}>
            <Text>Are you sure you want to delete this profile?</Text>
            <Button
              onPress={handleConfirmDelete}
              title="Yes"
            />
            <Button
              onPress={() => setConfirmVisible(false)}
              title="No"
            />
          </View>
        </View>
      </Modal>

      {/* Modal for editing a profile */}
      <Modal
        transparent
        visible={!!profileToEdit}
        animationType="fade"
        onRequestClose={() => setProfileToEdit(null)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Profile Title"
              onChangeText={(newText) => setProfileToEdit({ ...profileToEdit, title: newText })}
              value={profileToEdit?.title}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={(newText) => setProfileToEdit({ ...profileToEdit, username: newText })}
              value={profileToEdit?.username}
            />
            <Button
              onPress={() => copyToClipboard(profileToEdit?.username || '')}
              title="Copy Username"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={(newText) => setProfileToEdit({ ...profileToEdit, password: newText })}
              value={profileToEdit?.password}
            />
            <Button
              onPress={() => copyToClipboard(profileToEdit?.password || '')}
              title="Copy Password"
            />
            <Button
              onPress={handleUpdateProfile}
              title="Update Profile"
            />
            <Button
              onPress={() => setProfileToEdit(null)}
              title="Back"
            />
          </View>
        </View>
      </Modal>

      {/* Button to show the form for creating a new profile */}
      {!formVisible && (
        <View>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => setFormVisible(true)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List of profiles */}
      <FlatList
        data={filteredProfiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isPasswordVisible = passwordVisibility[item.id] || false; // Check if the password is visible for this profile

          return (
            <TouchableOpacity onPress={() => setProfileToEdit(item)}>
              <View style={styles.profileContainer}>
                <Text style={styles.text}>{item.title}</Text>
                <Text style={styles.text}>Username: {item.username}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setPasswordVisibility((prev) => ({
                      ...prev,
                      [item.id]: !isPasswordVisible, // Toggle password visibility for this profile
                    }))
                  }
                >
<View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
  <Text style={styles.text}>
    Password: {passwordVisibility[item.id] ? item.password : '***'}
  </Text>
  <Button
    title={passwordVisibility[item.id] ? 'HIDE' : 'SHOW'}
    onPress={() => {
      setPasswordVisibility(prev => ({
        ...prev,
        [item.id]: !prev[item.id], // toggle true/false
      }));
    }}
  />
</View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={modalStyles.deleteButton}
                  onPress={() => confirmDeleteProfile(item)}
                >
                  <Text style={modalStyles.deleteButtonText}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export default ProfileHandler;