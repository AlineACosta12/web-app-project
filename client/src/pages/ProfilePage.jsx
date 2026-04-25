// MoodPlay — Profile Page
// This page allows logged-in users to view and edit their profile.
// Users can update username/email, choose one of the preset avatars,
// change their password, or delete their account.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi, pickUser } from "../services/api";

// Preset avatar images stored in client/public/avatars.
// These are used instead of file uploads to keep the feature simple and reliable.
const avatarOptions = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
  "/avatars/avatar8.png",
  "/avatars/avatar9.png",
  "/avatars/avatar10.png",
  "/avatars/avatar11.png",
  "/avatars/avatar12.png",
  "/avatars/avatar13.png",
  "/avatars/avatar14.png",
  "/avatars/avatar15.png",
  "/avatars/avatar16.png",
];

export default function ProfilePage() {
  const navigate = useNavigate();

  // Stores the currently logged-in user's profile information.
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  // Stores the editable profile form fields.
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    avatar: "",
  });

  // Stores password change form fields.
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Controls loading, saving, success, and error states.
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch the logged-in user's profile from the backend when the page loads.
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await profileApi.getProfile();
        const user = pickUser(data);

        setProfile(user);
        localStorage.setItem("user", JSON.stringify(user));

        // Only allow saved avatars that match the preset avatar list.
        // This prevents old external image URLs from being displayed.
        const savedAvatar = avatarOptions.includes(user?.avatar)
          ? user.avatar
          : "";

        setEditForm({
          username: user?.username || "",
          email: user?.email || "",
          avatar: savedAvatar,
        });
      } catch (err) {
        setError(err.message);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // Returns the first letter of the username if no avatar is selected.
  function getInitial() {
    return profile?.username?.charAt(0)?.toUpperCase() || "U";
  }

  // Updates the profile form when the user types in username/email fields.
  function handleEditChange(e) {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Updates the selected avatar in the edit form.
  function handleAvatarSelect(avatar) {
    setEditForm((prev) => ({
      ...prev,
      avatar,
    }));
  }

  // Updates the password form when the user types.
  function handlePasswordChange(e) {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Sends updated profile information to the backend.
  async function handleProfileUpdate(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    // Client-side validation for profile updates.
    if (!editForm.username.trim() || !editForm.email.trim()) {
      setError("Username and email are required.");
      return;
    }

    if (editForm.username.trim().length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSavingProfile(true);

    try {
      const data = await profileApi.updateProfile(editForm);
      const updatedUser = pickUser(data);

      setProfile(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  // Sends password change request to the backend.
  async function handlePasswordUpdate(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    // Client-side validation for password changes.
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setError("Current password and new password are required.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);

    try {
      await profileApi.changePassword(passwordForm);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setMessage("Password updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPassword(false);
    }
  }

  // Confirms and deletes the user's account.
  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );

    if (!confirmed) return;

    try {
      await profileApi.deleteProfile();

      // Only remove the UI session key — profileApi already cleaned up the mock storage.
      localStorage.removeItem("user");
      navigate("/register");
    } catch (err) {
      setError(err.message);
    }
  }

  // Loading state while the profile is being fetched.
  if (loading) {
    return (
      <section className="container">
        <p>Loading profile...</p>
      </section>
    );
  }

  // Error state if the session expired or profile could not be loaded.
  if (!profile && error) {
    return (
      <section className="container">
        <div className="profile-card">
          <h1>Profile</h1>
          <p className="error-message">{error}</p>
          <button className="btn" onClick={() => navigate("/login")}>
            Login again
          </button>
        </div>
      </section>
    );
  }

  // Display only preset avatars, otherwise show the user's initial.
  const displayedAvatar = avatarOptions.includes(editForm.avatar)
    ? editForm.avatar
    : avatarOptions.includes(profile?.avatar)
      ? profile.avatar
      : "";

  return (
    <section className="container profile-page">
      <div className="profile-header-card">
        <div className="profile-avatar">
          {displayedAvatar ? (
            <img src={displayedAvatar} alt="Profile avatar" />
          ) : (
            getInitial()
          )}
        </div>

        <div>
          <h1>{profile?.username || "User Profile"}</h1>
          <p>{profile?.email || "No email available"}</p>
          <span className="role-badge">{profile?.role || "user"}</span>
        </div>
      </div>

      {message && <p className="success-message profile-message">{message}</p>}
      {error && <p className="error-message profile-message">{error}</p>}

      <div className="profile-sections">
        <form className="profile-panel" onSubmit={handleProfileUpdate}>
          <h2>Edit Profile</h2>
          <p>Update your account information and choose an avatar.</p>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            value={editForm.username}
            onChange={handleEditChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={editForm.email}
            onChange={handleEditChange}
            required
          />

          <label>Choose Avatar</label>

          <div className="avatar-options">
            {avatarOptions.map((avatar) => (
              <button
                type="button"
                key={avatar}
                className={
                  editForm.avatar === avatar
                    ? "avatar-option selected-avatar"
                    : "avatar-option"
                }
                onClick={() => handleAvatarSelect(avatar)}
              >
                <img src={avatar} alt="Avatar option" />
              </button>
            ))}
          </div>

          <button type="submit" className="btn" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>

        <form className="profile-panel" onSubmit={handlePasswordUpdate}>
          <h2>Change Password</h2>
          <p>Use a strong password with at least 6 characters.</p>

          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            required
          />

          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            required
            minLength="6"
          />

          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            id="confirmNewPassword"
            type="password"
            name="confirmNewPassword"
            value={passwordForm.confirmNewPassword}
            onChange={handlePasswordChange}
            required
            minLength="6"
          />

          <button type="submit" className="btn" disabled={savingPassword}>
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="profile-panel danger-panel">
          <h2>Danger Zone</h2>
          <p>
            Deleting your account will remove your profile access from MoodPlay.
          </p>

          <button className="btn btn-danger" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </section>
  );
}
