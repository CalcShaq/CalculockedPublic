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
export default Profile;