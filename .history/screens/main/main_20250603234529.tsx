# Modified main.tsx with Show/Hide Password for Profile List

```tsx
import React, { useEffect, useState } from 'react';

import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Modal, Pressable, StyleSheet
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import styles from '../../utils/styles/MainStyles'; // Assuming you have a styles.js file for styles
import { useNavigation } from '@react-navigation/native';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-very-secure-key'; // Replace with secure key management in production

function encryptData(data: object): string {
  const dataString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
}

function decryptData(ciphertext: string): any {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedString);
}

interface Profile {
  id: string;
  title: string;
  username: string;
  password: string;
}

const ProfileScreen = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // NEW: State for showing/hiding passwords in the profile list
  const [showProfilePasswords, setShowProfilePasswords] = useState<{[key: string]: boolean}>({});
  
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigation = useNavigation();

  // NEW: Function to toggle password visibility for a specific profile
  const toggleProfilePasswordVisibility = (profileId: string) => {
    setShowProfilePasswords(prev => ({
      ...prev,
      [profileId]: !prev[profileId]
    }));
  };

  useEffect(() => {
    const user = auth().currentUser;
    console.log('Current user:', user?.uid);
    if (!user) {
      Alert.alert('Authentication Error', 'Please log in first');
      setLoading(false);
      return;
    }

    const userId = user.uid;
    console.log('Fetching profiles for user:', userId);
    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .collection('profiles')
      .onSnapshot(
        snapshot => {
          console.log('Firestore snapshot received:', snapshot.docs.length, 'documents');
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Profile, 'id'>),
          }));
          setProfiles(data);
          setLoading(false);
        },
        error => {
          console.error('Firestore error details:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          let errorMessage = 'Could not fetch profiles.';
          if (error.code === 'permission-denied') {
            errorMessage = 'Permission denied. Please check Firestore security rules.';
          } else if (error.code === 'unauthenticated') {
            errorMessage = 'User not authenticated. Please log in again.';
          }

          Alert.alert('Error', `${errorMessage}\n\nDetails: ${error.message}`);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const createProfile = async () => {
    if (!title.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'All fields are required!');
      return;
    }

    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Authentication Error', 'Please log in first');
        return;
      }

      const userId = user.uid;
      console.log('Creating profile for user:', userId);
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('profiles')
        .add({ title, username, password });
      setTitle('');
      setUsername('');
      setPassword('');
      setShowPassword(false);
      setShowCreateForm(false);
      console.log('Profile created successfully');
    } catch (error: any) {
      console.error('Create profile error:', error);
      console.error('Error code:', error.code);
      let errorMessage = 'Failed to create profile.';
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check Firestore security rules.';
      } else if (error.code === 'unauthenticated') {
        errorMessage = 'User not authenticated. Please log in again.';
      }

      Alert.alert('Error', `${errorMessage}\n\nDetails: ${error.message}`);
    }
  };

  const deleteProfile = async (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth().currentUser;
              if (!user) {
                Alert.alert('Authentication Error', 'Please log in first');
                return;
              }

              const userId = user.uid;
              console.log('Deleting profile:', id, 'for user:', userId);
              await firestore()
                .collection('users')
                .doc(userId)
                .collection('profiles')
                .doc(id)
                .delete();
              console.log('Profile deleted successfully');
            } catch (error: any) {
              console.error('Delete profile error:', error);
              console.error('Error code:', error.code);
              let errorMessage = 'Failed to delete profile.';
              if (error.code === 'permission-denied') {
                errorMessage = 'Permission denied. Please check Firestore security rules.';
              } else if (error.code === 'unauthenticated') {
                errorMessage = 'User not authenticated. Please log in again.';
              }

              Alert.alert('Error', `${errorMessage}\n\nDetails: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const openEditModal = (profile: Profile) => {
    setEditingProfile(profile);
    setEditTitle(profile.title);
    setEditUsername(profile.username);
    setEditPassword(profile.password);
    setShowEditPassword(false);
    setEditModalVisible(true);
  };

  const saveProfileEdit = async () => {
    if (!editTitle.trim() || !editUsername.trim() || !editPassword.trim()) {
      Alert.alert('Validation Error', 'All fields are required!');
      return;
    }

    try {
      const user = auth().currentUser;
      if (!user || !editingProfile) {
        Alert.alert('Authentication Error', 'Please log in first');
        return;
      }

      const userId = user.uid;
      console.log('Updating profile:', editingProfile.id, 'for user:', userId);
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('profiles')
        .doc(editingProfile.id)
        .update({
          title: editTitle,
          username: editUsername,
          password: editPassword,
        });
      setEditModalVisible(false);
      setEditingProfile(null);
      setShowEditPassword(false);
      console.log('Profile updated successfully');
    } catch (error: any) {
      console.error('Update profile error:', error);
      console.error('Error code:', error.code);
      let errorMessage = 'Failed to update profile.';
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check Firestore security rules.';
      } else if (error.code === 'unauthenticated') {
        errorMessage = 'User not authenticated. Please log in again.';
      }

      Alert.alert('Error', `${errorMessage}\n\nDetails: ${error.message}`);
    }
  };

  const handleProfileOptions = (profile: Profile) => {
    Alert.alert(
      'Profile Options',
      `What would you like to do with "${profile.title}"?`,
      [
        { text: 'Edit', onPress: () => openEditModal(profile) },
        { text: 'Delete', onPress: () => deleteProfile(profile.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const navigateToSettings = () => {
    setMenuVisible(false);
    navigation.navigate('Settings' as never); // Replace with your navigation logic
    Alert.alert('Settings', 'Navigate to Settings screen');
    // Example: navigation.navigate('Settings');
  };

  const handleMenuOption = (option: string) => {
    setMenuVisible(false);
    switch (option) {
      case 'settings':
        navigateToSettings();
        break;
      case 'logout':
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: () => {
                auth().signOut().catch(error => {
                  console.error('Logout error:', error);
                });
                navigation.replace('Welcome' as never);
              },
            },
          ]
        );
        break;
      case 'lockapp':
        navigation.replace('Calculator' as never);
        break;
      default:
        break;
    }
  };

  // Show authentication prompt if user is not logged in
  if (!auth().currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Authentication Required</Text>
        <Text style={styles.label}>Please log in to access your profiles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Burger Menu */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setMenuVisible(!menuVisible)}
          style={styles.menuButton}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Profile Manager</Text>
      </View>

      {/* Dropdown Menu */}
      {menuVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            onPress={() => handleMenuOption('settings')}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>⚙️ Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleMenuOption('logout')}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>🚪 Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleMenuOption('lockapp')}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>🔒 Calculock app</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        {!showCreateForm && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateForm(true)}
          >
            <Text style={styles.createButtonText}>+ Create New Profile</Text>
          </TouchableOpacity>
        )}

        {/* Create Profile Form */}
        {showCreateForm && (
          <View style={styles.createForm}>
            <Text style={styles.formTitle}>Create New Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Title (e.g., Gmail, Facebook)"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.showHideButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.showHideText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formButtons}>
              <TouchableOpacity style={styles.submitButton} onPress={createProfile}>
                <Text style={styles.submitButtonText}>Create Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowCreateForm(false);
                  setTitle('');
                  setUsername('');
                  setPassword('');
                  setShowPassword(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Profiles List */}
        <View style={styles.profilesSection}>
          <Text style={styles.sectionTitle}>Your Profiles ({profiles.length})</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0066cc" />
          ) : (
            <View>
              {profiles.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No profiles found</Text>
                  <Text style={styles.emptySubtext}>Create your first profile above!</Text>
                </View>
              ) : (
                profiles.map(profile => (
                  <TouchableOpacity
                    key={profile.id}
                    onPress={() => handleProfileOptions(profile)}
                    activeOpacity={0.7}
                    style={styles.profileCard}
                  >
                    <View style={styles.profileHeader}>
                      <Text style={styles.profileTitle}>{profile.title}</Text>
                      <Text style={styles.tapToEdit}>Tap to edit or delete</Text>
                    </View>
                    <View style={styles.profileDetails}>
                      <Text style={styles.detailLabel}>Username:</Text>
                      <Text style={styles.detailValue}>{profile.username}</Text>
                    </View>
                    <View style={styles.profileDetails}>
                      <Text style={styles.detailLabel}>Password:</Text>
                      <View style={styles.passwordDisplayContainer}>
                        <Text style={styles.detailValue}>
                          {showProfilePasswords[profile.id] 
                            ? profile.password 
                            : '•'.repeat(Math.min(profile.password.length, 12))}
                        </Text>
                        <TouchableOpacity
                          style={styles.showHideButtonSmall}
                          onPress={() => toggleProfilePasswordVisibility(profile.id)}
                        >
                          <Text style={styles.showHideTextSmall}>
                            {showProfilePasswords[profile.id] ? 'Hide' : 'Show'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={editUsername}
              onChangeText={setEditUsername}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                value={editPassword}
                onChangeText={setEditPassword}
                secureTextEntry={!showEditPassword}
              />
              <TouchableOpacity
                style={styles.showHideButton}
                onPress={() => setShowEditPassword(!showEditPassword)}
              >
                <Text style={styles.showHideText}>
                  {showEditPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.submitButton} onPress={saveProfileEdit}>
                <Text style={styles.submitButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEditModalVisible(false);
                  setShowEditPassword(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Additional styles for the new features
const additionalStyles = StyleSheet.create({
  passwordDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  showHideButtonSmall: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  showHideTextSmall: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    marginRight: 10,
  },
  showHideButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  showHideText: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
  },
});

export default ProfileScreen;
```

