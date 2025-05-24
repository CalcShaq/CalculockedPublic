import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30, // Reduced from 45
    paddingBottom: 4, // Reduced from 10
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 16, // Reduced from 18
    fontWeight: '700',
    color: '#2c3e50',
  },
  createIconButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createIconText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 24,
  },
  headerPlaceholder: {
    width: 35, // Reduced from 40
  },
  burgerButton: {
    padding: 6, // Reduced from 8
    justifyContent: 'center',
    alignItems: 'center',
    width: 35, // Reduced from 40
    height: 35, // Reduced from 40
  },
  burgerLine: {
    width: 18, // Reduced from 20
    height: 2,
    backgroundColor: '#2c3e50',
    marginVertical: 2,
    borderRadius: 1,
  },
  menuDropdown: {
    position: 'absolute',
    top: 65, // Adjusted to match smaller header
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1001,
    borderWidth: 1,
    borderColor: '#e8ecf0',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  profilesHeader: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  heading: { 
    fontSize: 22, // Reduced from 24
    fontWeight: '700', 
    marginBottom: 15, // Reduced from 20
    marginTop: 15, // Reduced from 20
    textAlign: 'center',
    color: '#2c3e50',
    paddingHorizontal: 20,
  },
  sectionHeading: {
    fontSize: 18, // Increased from 16
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 0, // Removed top margin
    color: '#34495e',
  },
  input: {
    backgroundColor: '#fff', 
    borderRadius: 12, 
    borderColor: '#e1e8ed',
    borderWidth: 1, 
    padding: 15, 
    marginBottom: 15,
    marginHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    color: 'black',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  passwordInput: {
    marginBottom: 0,
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
  },
  eyeText: {
    fontSize: 20,
  },
  createButton: {
    backgroundColor: '#3498db', 
    borderRadius: 12,
    padding: 16, 
    alignItems: 'center', 
    marginBottom: 20, // Reduced from 25
    marginHorizontal: 20,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16 
  },
  scrollView: { 
    flex: 1 
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12, // Reduced from 16
    padding: 12, // Reduced from 20
    marginBottom: 10, // Reduced from 15 
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e8ecf0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Reduced shadow
    shadowOpacity: 0.08, // Reduced shadow opacity
    shadowRadius: 2, // Reduced shadow radius
    elevation: 2, // Reduced elevation
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // Reduced from 12
    paddingBottom: 6, // Reduced from 8
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  profileTitle: {
    fontSize: 16, // Reduced from 18
    fontWeight: '700',
    color: '#2c3e50',
    flex: 1,
  },
  tapHint: {
    fontSize: 11, // Reduced from 12
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6, // Reduced from 8
  },
  profileLabel: {
    fontSize: 13, // Reduced from 14
    fontWeight: '600',
    color: '#7f8c8d',
    width: 70, // Reduced from 80
  },
  profileValue: {
    fontSize: 15, // Reduced from 16
    color: '#2c3e50',
    flex: 1,
    fontFamily: 'monospace',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', 
    paddingHorizontal: 24,
  },
  modalContent: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeading: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 20, 
    textAlign: 'center',
    color: '#2c3e50'
  },
  modalButtonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 25,
    gap: 10,
  },
  modalButton: { 
    flex: 1, 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16 
  },
});

export default styles;