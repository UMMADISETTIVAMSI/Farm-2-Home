import React, { useState } from 'react';
import { auth } from '../utils/api';

const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    farmName: user.farmName || '',
    address: user.address || '',
    profileImage: user.profileImage || ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({...profile, profileImage: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { email, ...updateData } = profile;
      const response = await auth.updateProfile(updateData);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert(error.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-md mx-auto theme-card p-6 rounded-lg">
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center overflow-hidden">
            {(profile.profileImage || user.profileImage) ? (
              <img 
                src={profile.profileImage || user.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span className="theme-text-secondary text-2xl">👤</span>
            )}
          </div>
          <h2 className="text-2xl font-bold theme-text-primary">
            {user.role === 'farmer' ? 'Farmer' : 'Client'} Profile
          </h2>
        </div>
        
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium theme-text-secondary">Name</label>
              <p className="mt-1 theme-text-primary">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium theme-text-secondary">Email</label>
              <p className="mt-1 theme-text-primary">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium theme-text-secondary">Role</label>
              <p className="mt-1 theme-text-primary capitalize">{user.role}</p>
            </div>
            {user.phone && (
              <div>
                <label className="block text-sm font-medium theme-text-secondary">Phone</label>
                <p className="mt-1 theme-text-primary">{user.phone}</p>
              </div>
            )}
            {user.role === 'farmer' && user.farmName && (
              <div>
                <label className="block text-sm font-medium theme-text-secondary">Farm Name</label>
                <p className="mt-1 theme-text-primary">{user.farmName}</p>
              </div>
            )}
            {user.address && (
              <div>
                <label className="block text-sm font-medium theme-text-secondary">Address</label>
                <p className="mt-1 theme-text-primary">{user.address}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium theme-text-secondary">Profile Photo</label>
              <p className="mt-1 theme-text-primary">{user.profileImage ? 'Uploaded' : 'Not uploaded'}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium theme-text-primary mb-2">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-3 theme-border rounded-lg theme-card theme-text-primary"
                onChange={handleImageUpload}
              />
              {profile.profileImage && (
                <img src={profile.profileImage} alt="Preview" className="w-20 h-20 rounded-full mt-2 object-cover" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium theme-text-primary">Name</label>
              <input
                type="text"
                className="mt-1 w-full p-3 theme-border rounded-lg theme-card theme-text-primary"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium theme-text-primary">Phone</label>
              <input
                type="tel"
                className="mt-1 w-full p-3 theme-border rounded-lg theme-card theme-text-primary"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            </div>
            {user.role === 'farmer' && (
              <div>
                <label className="block text-sm font-medium theme-text-primary">Farm Name</label>
                <input
                  type="text"
                  className="mt-1 w-full p-3 theme-border rounded-lg theme-card theme-text-primary"
                  value={profile.farmName}
                  onChange={(e) => setProfile({...profile, farmName: e.target.value})}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium theme-text-primary">Address</label>
              <textarea
                className="mt-1 w-full p-3 theme-border rounded-lg theme-card theme-text-primary"
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                rows="3"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;