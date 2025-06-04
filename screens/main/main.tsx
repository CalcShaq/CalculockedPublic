import React, { useEffect, useState } from 'react'; // Import React and useState, useEffect hooks for managing state and side effects
import {View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, Pressable, StyleSheet} from 'react-native'; // Import necessary components from React Native
import firestore from '@react-native-firebase/firestore'; // Import Firestore for database operations
import auth from '@react-native-firebase/auth'; // Import Firebase authentication for user management
import styles from '../../utils/styles/MainStyles'; // Import custom styles for the main screen assuming styles are defined in this file
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook for navigation
import CryptoJS from 'crypto-js'; // Import CryptoJS for encryption and decryption of sensitive data

const SECRET_KEY = 'your-very-secure-key'; // Define a secret key for encryption and decryption
// Replace with secure key management in production 

// Encrypt function using CryptoJS
function encryptData(data: object): string { // Function to encrypt data
  const dataString = JSON.stringify(data); // Convert data object to string
  return CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString(); // Encrypt the string using AES encryption
}

// Decrypt function using CryptoJS
function decryptData(ciphertext: string): any { // Function to decrypt data
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY); // Decrypt the ciphertext using AES decryption
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8); // Convert decrypted bytes to string
  return JSON.parse(decryptedString); // Parse the decrypted string back to an object
}

// Define the Profile interface for TypeScript type checking
interface Profile {  // Interface for Profile object
  id: string; // Unique identifier for the profile
  title: string; // Title of the profile (e.g., Work Account, Personal, etc.)
  username: string; // Username associated with the profile
  password: string; // Password associated with the profile
}

// Main ProfileScreen component
const ProfileScreen = () => { // Main component for managing user profiles
  const [profiles, setProfiles] = useState<Profile[]>([]); // State to hold the list of profiles
  const [loading, setLoading] = useState(true); // State to manage loading state while fetching profiles
  const [title, setTitle] = useState(''); // State to hold the title input for creating a new profile
  const [username, setUsername] = useState(''); // State to hold the username input for creating a new profile
  const [password, setPassword] = useState(''); // State to hold the password input for creating a new profile
  const [showPassword, setShowPassword] = useState(false); // State to manage visibility of the password input 
  const [showAllPasswords, setShowAllPasswords] = useState(false); // State to manage visibility of all passwords in the profile list

  const [editingProfile, setEditingProfile] = useState<Profile | null>(null); // State to hold the profile being edited
  const [editTitle, setEditTitle] = useState(''); // State to hold the title input for editing a profile
  const [editUsername, setEditUsername] = useState(''); // State to hold the username input for editing a profile
  const [editPassword, setEditPassword] = useState(''); // State to hold the password input for editing a profile
  const [editModalVisible, setEditModalVisible] = useState(false); // State to manage visibility of the edit profile modal
  const [showEditPassword, setShowEditPassword] = useState(false); // State to manage visibility of the password input in the edit profile modal
  const [menuVisible, setMenuVisible] = useState(false); // State to manage visibility of the burger menu
  const [showCreateForm, setShowCreateForm] = useState(false); // State to manage visibility of the create profile form
  const navigation = useNavigation(); // Use useNavigation hook to get navigation object
  
  // Fetch profiles from Firestore when the component mounts
  useEffect(() => { // Effect to fetch profiles from Firestore
    const user = auth().currentUser; // Get the currently authenticated user
    console.log('Current user:', user?.uid); // Log the user ID for debugging
    
    // If no user is authenticated, show an alert and stop loading
    if (!user) { // Check if user is authenticated
      Alert.alert('Authentication Error', 'Please log in first'); // Show alert if no user is authenticated
      setLoading(false); // Set loading to false to stop the loading indicator
      return; // Exit the effect if no user is authenticated
    }

    // If user is authenticated, fetch their profiles from Firestore
    const userId = user.uid; // Get the user ID of the authenticated user
    console.log('Fetching profiles for user:', userId); // Log the user ID for debugging

    // Subscribe to Firestore collection for real-time updates
    const unsubscribe = firestore() // Get Firestore instance
      .collection('users') // Access the 'users' collection
      .doc(userId) // Access the document for the current user
      .collection('profiles') // Access the 'profiles' sub-collection
      .onSnapshot( // Listen for real-time updates to the profiles collection
        snapshot => { // Check if snapshot is received
          console.log('Firestore snapshot received:', snapshot.docs.length, 'documents'); // Log the number of documents received
          const data = snapshot.docs.map(doc => ({ // Map the documents to Profile objects
            id: doc.id, // Get the document ID
            ...(doc.data() as Omit<Profile, 'id'>), // Spread the document data, excluding the 'id' field
          }));
          setProfiles(data); // Update the profiles state with the fetched data
          setLoading(false); // Set loading to false to stop the loading indicator
        },
        error => { // Handle errors while fetching profiles
          // Log the error details for debugging
          console.error('Firestore error details:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          
          // Show an alert with the error message
          let errorMessage = 'Could not fetch profiles.'; // Default error message
          if (error.code === 'permission-denied') { // Check if the error is due to permission denial
            errorMessage = 'Permission denied. Please check Firestore security rules.'; // Set error message for permission denial
          } else if (error.code === 'unauthenticated') { // Check if the error is due to unauthenticated user
            errorMessage = 'User not authenticated. Please log in again.'; // Set error message for unauthenticated user
          }
          
          // Show an alert with the error message
          Alert.alert('Error', `${errorMessage}\n\nDetails: ${error.message}`); // Show alert with error details
          setLoading(false); // Set loading to false to stop the loading indicator
        }
      );

    return () => unsubscribe(); // Cleanup function to unsubscribe from Firestore updates when the component unmounts
  }, []);

  // Function to create a new profile
  const createProfile = async () => { // Function to create a new profile
    if (!title.trim() || !username.trim() || !password.trim()) { // Check if all fields are filled
      Alert.alert('Validation Error', 'All fields are required!'); // Show an alert if validation fails
      return; // Exit the function if validation fails
    }

    // Check if user is authenticated before creating a profile
    try { // Check if user is authenticated
      const user = auth().currentUser; // Get the currently authenticated user
      if (!user) { // If no user is authenticated, show an alert and stop the profile creation
        Alert.alert('Authentication Error', 'Please log in first'); // Show alert if no user is authenticated
        return; // Exit the function if no user is authenticated
      }
      
      // If user is authenticated, create a new profile in Firestore
      const userId = user.uid; // Get the user ID of the authenticated user
      console.log('Creating profile for user:', userId); // Log the user ID for debugging
      
      // Add a new document to the 'profiles' sub-collection for the current user
      await firestore() // Get Firestore instance
        .collection('users') // Access the 'users' collection
        .doc(userId) // Access the document for the current user
        .collection('profiles') // Access the 'profiles' sub-collection
        .add({ title, username, password }); // Add a new profile document with the provided title, username, and password

      // Reset the input fields and hide the create profile form modal so the user can create another profile if needed
      setTitle(''); // Reset the title input field
      setUsername(''); // Reset the username input field
      setPassword(''); // Reset the password input field
      setShowPassword(false); // Reset the show password state
      setShowCreateForm(false); // Hide the create profile form modal
      console.log('Profile created successfully'); // Log success message for profile creation
    } catch (error: any) { // Catch any errors during profile creation
      console.error('Create profile error:', error); // Log the error details for debugging
      console.error('Error code:', error.code); // Log the error code for debugging
      
      // Show an alert with the error message
      let errorMessage = 'Failed to create profile.'; // Default error message 
      if (error.code === 'permission-denied') { // Check if the error is due to permission denial
        errorMessage = 'Permission denied. Please check Firestore security rules.'; // Set error message for permission denial
      } else if (error.code === 'unauthenticated') { // Check if the error is due to unauthenticated user
        errorMessage = 'User not authenticated. Please log in again.'; // Set error message for unauthenticated user
      }
      
      // Show an alert with the error message
      Alert.alert('Error', `${errorMessage}\n\nDetails: ${error.message}`); // Show alert with error details
    }
  };

  // Function to delete a profile
  const deleteProfile = async (id: string) => { // Function to delete a profile by its ID
    // Show confirmation alert before deleting the profile
    Alert.alert( // Show confirmation alert before deleting the profile
      'Confirm Delete',
      'Are you sure you want to delete this profile?',
      [
        { text: 'Cancel', style: 'cancel' }, // Cancel button to close the alert without deleting
        {
          text: 'Delete', // Delete button to confirm deletion
          style: 'destructive', // Style the delete button as destructive
          onPress: async () => { // Function to execute when the delete button is pressed
            try { // Check if user is authenticated before deleting a profile
              const user = auth().currentUser; // Get the currently authenticated user
              if (!user) { // If no user is authenticated, show an alert and stop the profile deletion
                Alert.alert('Authentication Error', 'Please log in first'); // Show alert if no user is authenticated
                return;// Exit the function if no user is authenticated
              }

              // If user is authenticated, delete the profile from Firestore
              const userId = user.uid; // Get the user ID of the authenticated user
              console.log('Deleting profile:', id, 'for user:', userId); // Log the profile ID and user ID for debugging
              
              // Delete the profile document from the 'profiles' sub-collection for the current user
              await firestore() // Get Firestore instance
                .collection('users') // Access the 'users' collection
                .doc(userId) // Access the document for the current user
                .collection('profiles') // Access the 'profiles' sub-collection
                .doc(id) // Access the specific profile document by its ID
                .delete(); // Delete the profile document
                
              // Reset the profiles state to remove the deleted profile
              console.log('Profile deleted successfully'); // Log success message for profile deletion
            } catch (error: any) { // Catch any errors during profile deletion
              console.error('Delete profile error:', error); // Log the error details for debugging
              console.error('Error code:', error.code); // Log the error code for debugging
              
              // Show an alert with the error message
              let errorMessage = 'Failed to delete profile.'; // Default error message
              if (error.code === 'permission-denied') { // Check if the error is due to permission denial
                errorMessage = 'Permission denied. Please check Firestore security rules.'; // Set error message for permission denial
              } else if (error.code === 'unauthenticated') { // Check if the error is due to unauthenticated user
                errorMessage = 'User not authenticated. Please log in again.'; // Set error message for unauthenticated user
              }
              
              // Show an alert with the error message
              Alert.alert('Error', `${errorMessage}\n\nDetails: ${error.message}`); // Show alert with error details
            }
          }
        }
      ]
    );
  };

  // Function to open the edit profile modal
  const openEditModal = (profile: Profile) => { // Function to open the edit profile modal with the selected profile data
    setEditingProfile(profile); // Set the profile being edited
    setEditTitle(profile.title); // Set the title input field with the profile title
    setEditUsername(profile.username); // Set the username input field with the profile username
    setEditPassword(profile.password); // Set the password input field with the profile password
    setShowEditPassword(false); // Reset the show password state for the edit modal
    setEditModalVisible(true); // Show the edit profile modal
  };

  // Function to save changes made in the edit profile modal
  const saveProfileEdit = async () => { // Function to save changes made in the edit profile modal
    if (!editTitle.trim() || !editUsername.trim() || !editPassword.trim()) { // Check if all fields are filled
      Alert.alert('Validation Error', 'All fields are required!'); // Show an alert if validation fails
      return;
    }

    // Check if user is authenticated before saving changes
    try { // Check if user is authenticated
      const user = auth().currentUser; // Get the currently authenticated user
      if (!user || !editingProfile) { // If no user is authenticated or no profile is being edited, show an alert and stop saving changes
        Alert.alert('Authentication Error', 'Please log in first'); // Show alert if no user is authenticated or no profile is being edited
        return; // Exit the function if no user is authenticated or no profile is being edited
      }
      
      // If user is authenticated, update the profile in Firestore
      const userId = user.uid; // Get the user ID of the authenticated user
      console.log('Updating profile:', editingProfile.id, 'for user:', userId); // Log the profile ID and user ID for debugging
      
      // Update the profile document in the 'profiles' sub-collection for the current user
      await firestore() // Get Firestore instance
        .collection('users') // Access the 'users' collection
        .doc(userId) // Access the document for the current user
        .collection('profiles') // Access the 'profiles' sub-collection
        .doc(editingProfile.id) // Access the specific profile document by its ID
        .update({ // Update the profile document with the new data
          title: editTitle, // Update the title field with the new title
          username: editUsername, // Update the username field with the new username
          password: editPassword, // Update the password field with the new password
        });

      // Reset the input fields and hide the edit profile modal
      setEditModalVisible(false); // Hide the edit profile modal
      setEditingProfile(null); // Reset the profile being edited
      setShowEditPassword(false); // Reset the show password state for the edit modal
      console.log('Profile updated successfully'); // Log success message for profile update
    } catch (error: any) { // Catch any errors during profile update
      console.error('Update profile error:', error); // Log the error details for debugging
      console.error('Error code:', error.code); // Log the error code for debugging
      
      // Show an alert with the error message
      let errorMessage = 'Failed to update profile.'; // Default error message
      if (error.code === 'permission-denied') { // Check if the error is due to permission denial
        errorMessage = 'Permission denied. Please check Firestore security rules.'; // Set error message for permission denial
      } else if (error.code === 'unauthenticated') { // Check if the error is due to unauthenticated user
        errorMessage = 'User not authenticated. Please log in again.'; // Set error message for unauthenticated user
      }
      // Show an alert with the error message
      Alert.alert('Error', `${errorMessage}\n\nDetails: ${error.message}`); // Show alert with error details
    }
  };

  // Function to handle profile options (edit/delete)
  const handleProfileOptions = (profile: Profile) => { // Function to handle options for a specific profile
    Alert.alert( // Show an alert with options for the selected profile
      'Profile Options', // Title of the alert
      `What would you like to do with "${profile.title}"?`, // Message of the alert
      [
        { text: 'Edit', onPress: () => openEditModal(profile) }, // Option to edit the profile, opens the edit modal with the selected profile data
        { text: 'Delete', onPress: () => deleteProfile(profile.id), style: 'destructive' }, // Option to delete the profile, calls the deleteProfile function with the profile ID
        { text: 'Cancel', style: 'cancel' }, // Cancel option to close the alert without taking any action
      ]
    );
  };

  // Function to navigate to the Settings screen
  const navigateToSettings = () => { // Function to navigate to the Settings screen
    setMenuVisible(false); // Hide the menu before navigating
    navigation.navigate('Settings'); // Navigate to the Settings screen
    Alert.alert('Settings', 'Navigate to Settings screen'); // Show an alert indicating navigation to Settings
  };

  // Function to handle menu options (Settings, Logout, Lock App)
  const handleMenuOption = (option: string) => { // Function to handle menu options
    setMenuVisible(false); // Hide the menu before handling the option
    switch (option) { // Switch case to handle different menu options
      case 'settings': // Case for Settings option
        navigateToSettings(); // Call the function to navigate to Settings screen
        break; // Exit the switch case after handling Settings option
      case 'logout': // Case for Logout option
        Alert.alert( // Show confirmation alert before logging out
          'Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel' }, // Cancel button to close the alert without logging out
            { 
              text: 'Logout', // Logout button to confirm logout
              style: 'destructive', // Style the logout button as destructive
              onPress: () => { // Function to execute when the logout button is pressed
                auth().signOut().catch(error => { // Attempt to sign out the user
                  console.error('Logout error:', error); // Log the error details for debugging
                  
                });
                navigation.replace('Welcome'); // Navigate back to the Welcome screen after logout
              }
            }
          ]
        );
        // Show an alert to confirm logout
        break; // Exit the switch case after handling Logout option
      default: // Default case for any other options
        break; // Exit the switch case if no matching option is found
        case 'lockapp': // Case for Lock App option
          navigation.replace('Calculator'); // Navigate to the Calculator screen
          break;// Exit the switch case after handling Lock App option
    }
  };

  // Check if user is authenticated before rendering the profile manager
  if (!auth().currentUser) { // Check if no user is authenticated
    return ( // Render a view prompting the user to log in
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}> // 
        <Text style={styles.heading}>Authentication Required</Text>
        <Text style={{ textAlign: 'center', marginBottom: 20, color: '#666' }}>
          Please log in to access your profiles
        </Text>
      </View>
    );
  }

  // Render the main profile manager UI
  return ( // Render the main profile manager UI
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

      {/* Menu Overlay */}
      {menuVisible && (
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        />
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
          <Text style={styles.eyeText}>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={createProfile}>
        <Text style={styles.createButtonText}>Create Profile</Text>
      </TouchableOpacity>

      {/* Section Header with Password Toggle */}
      <View style={styles.profilesHeader}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.sectionHeading}>Your Profiles ({profiles.length})</Text>
          {profiles.length > 0 && (
            <TouchableOpacity
              onPress={() => setShowAllPasswords(!showAllPasswords)}
              style={{
                backgroundColor: showAllPasswords ? '#e74c3c' : '#3498db',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text style={{
                color: '#fff',
                fontSize: 12,
                fontWeight: '600',
              }}>
                {showAllPasswords ? 'Hide All Passwords' : 'Show All Passwords'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

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
                  <Text style={styles.tapHint}>Tap to edit or delete</Text>
                </View>
                
                <View style={styles.profileDetail}>
                  <Text style={styles.profileLabel}>Username:</Text>
                  <Text style={styles.profileValue}>{profile.username}</Text>
                </View>
                
                <View style={styles.profileDetail}>
                  <Text style={styles.profileLabel}>Password:</Text>
                  <Text style={styles.profileValue}>
                    {showAllPasswords 
                      ? profile.password 
                      : '•'.repeat(Math.min(profile.password.length, 12))
                    }
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
                <Text style={styles.eyeText}>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
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
                onPress={() => setShowEditPassword(!showEditPassword)} // Toggle visibility of the password input in the edit modal
              >
                <Text style={styles.eyeText}>{showEditPassword ? 'Hide Password' : 'Show Password'}</Text> 
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#4caf50' }]}
                onPress={saveProfileEdit} // Call the function to save changes made in the edit profile modal
              >
                <Text style={styles.modalButtonText}>Save Changes</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                onPress={() => {
                  setEditModalVisible(false); // Hide the edit modal
                  setShowEditPassword(false); // Reset the show password state for the edit modal
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

// Export the ProfileScreen component as the default export
export default ProfileScreen;