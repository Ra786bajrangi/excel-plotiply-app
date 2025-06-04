import React, { Component } from 'react';
import { toast } from 'react-toastify';

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      avatarPreview: '',
      formData: {
        username: '',
        email: '',
        bio: '',
        avatar: null
      }
    };
  }

  componentDidMount() {
    this.fetchProfile();
  }

  fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      console.log('Fetched profile data:', data);
      this.setState({
        user: data,
        loading: false,
        avatarPreview: data.avatar || '',
        formData: {
          username: data.username,
          email: data.email,
          bio: data.bio || '',
          avatar: null
        }
      });
    } catch (error) {
      toast.error(error.message);
      this.setState({ loading: false });
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  };

  handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          avatarPreview: reader.result,
          formData: {
            ...this.state.formData,
            avatar: file
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { formData } = this.state;
      const data = new FormData();
      
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('bio', formData.bio);
      if (formData.avatar) data.append('avatar', formData.avatar);

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) throw new Error('Update failed');

      const updatedUser = await response.json();
      this.setState({ 
        user: updatedUser,
        avatarPreview: updatedUser.avatar || '',
        formData: {
    username: updatedUser.username,
    email: updatedUser.email,
    bio: updatedUser.bio || '',
    avatar: null
  }
  
     
      });
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  render() {
    const { loading, avatarPreview, formData } = this.state;

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Update Profile</h1>
        
        <form onSubmit={this.handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <img
                src={avatarPreview || "/default-avatar.png"}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border-2 border-gray-200"
              />
            </div>
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={this.handleAvatarChange}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={this.handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={this.handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={this.handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Profile
          </button>
        </form>
      </div>
    );
  }
}

export default UpdateProfile;