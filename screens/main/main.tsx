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

  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigation = useNavigation();
  
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
          }
        }
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
    navigation.navigate('Settings'); // Replace with your navigation logic
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
                navigation.replace('Welcome');
              }
            }
          ]
        );
        break;
      default:
        break;
        case 'lockapp':
          navigation.replace('Calculator');
          break;
    }
  };

  // Show authentication prompt if user is not logged in
  if (!auth().currentUser) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.heading}>Authentication Required</Text>
        <Text style={{ textAlign: 'center', marginBottom: 20, color: '#666' }}>
          Please log in to access your profiles
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Burger Menu */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.burgerButton}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Profile Manager</Text>
        
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Dropdown Menu */}
      {menuVisible && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuOption('settings')}
          >
            <Text style={styles.menuItemText}>⚙️ Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuOption('logout')}
          >
            
            <Text style={styles.menuItemText}>🚪 Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuOption('lockapp')}
          >
            <Text style={styles.menuItemText}>Calculock app</Text>
          </TouchableOpacity>
        </View>
        
      )}



      <TextInput
        style={styles.input}
        placeholder="Profile Title (e.g., Work Account, Personal, etc.)"
        placeholderTextColor={'#D3D3D3'}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={'#D3D3D3'}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholderTextColor={'#D3D3D3'}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={createProfile}>
        <Text style={styles.createButtonText}>Create Profile</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeading}>Your Profiles ({profiles.length})</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0077cc" style={{ marginTop: 30 }} />
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {profiles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No profiles found</Text>
              <Text style={styles.emptySubtext}>Create your first profile above!</Text>
            </View>
          ) : (
            profiles.map(profile => (
              <TouchableOpacity
                key={profile.id}
                style={styles.profileCard}
                onPress={() => handleProfileOptions(profile)}
                activeOpacity={0.7}
              >
                <View style={styles.profileHeader}>
                  <Text style={styles.profileTitle}>{profile.title}</Text>
                  <Text style={styles.tapHint}>Tap to edit</Text>
                </View>
                
                <View style={styles.profileDetail}>
                  <Text style={styles.profileLabel}>Username:</Text>
                  <Text style={styles.profileValue}>{profile.username}</Text>
                </View>
                
                <View style={styles.profileDetail}>
                  <Text style={styles.profileLabel}>Password:</Text>
                  <Text style={styles.profileValue}>
                    {'•'.repeat(Math.min(profile.password.length, 12))}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* Create Profile Modal */}
      <Modal visible={showCreateForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Create New Profile</Text>

            <TextInput
              style={styles.input}
              placeholder="Profile Title (e.g., Work Account, Personal, etc.)"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#3498db' }]}
                onPress={createProfile}
              >
                <Text style={styles.modalButtonText}>Create Profile</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#95a5a6' }]}
                onPress={() => {
                  setShowCreateForm(false);
                  setTitle('');
                  setUsername('');
                  setPassword('');
                  setShowPassword(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              placeholder="Profile Title"
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={editUsername}
              onChangeText={setEditUsername}
              autoCapitalize="none"
            />
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                value={editPassword}
                onChangeText={setEditPassword}
                secureTextEntry={!showEditPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowEditPassword(!showEditPassword)}
              >
                <Text style={styles.eyeText}>{showEditPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#4caf50' }]}
                onPress={saveProfileEdit}
              >
                <Text style={styles.modalButtonText}>Save Changes</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                onPress={() => {
                  setEditModalVisible(false);
                  setShowEditPassword(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;