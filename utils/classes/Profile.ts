// This class defines a Profile object with properties for id, title, username, and password. It includes a constructor to initialize these properties.
class Profile { // This class defines a Profile object
  id: string; // Unique identifier for the profile
  title: string; // Title of the profile
  username: string; // Username associated with the profile
  password: string; // Password associated with the profile
  // Constructor to initialize the Profile object with id, title, username, and password
  constructor(id: string, title: string, username: string, password: string) { // Constructor to initialize the Profile object
    this.id = id; // Initialize id
    this.title = title; // Initialize title
    this.username = username; // Initialize username
    this.password = password; // Initialize password
  }
}

// Export the Profile class for use in other modules
export default Profile;