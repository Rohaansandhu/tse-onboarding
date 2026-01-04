import { useState } from "react";
import { type User } from "src/api/users";
import styles from "./UserTag.module.css";

export type UserTagProps = {
  user?: User | null;
  className?: string;
};

export function UserTag({ user, className }: UserTagProps) {
  const [imageError, setImageError] = useState(false);

  // If no user is provided, show "Not assigned" without an icon
  if (!user) {
    return (
      <div className={`${styles.container} ${className || ""}`}>
        <span className={styles.userName}>Not assigned</span>
      </div>
    );
  }

  // Determine which profile picture to use
  // Use default if: no URL provided, empty string, or image failed to load
  const profilePictureSrc = 
    !user.profilePictureURL || imageError 
      ? "/userDefault.svg" 
      : user.profilePictureURL;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <img
        src={profilePictureSrc}
        alt={`${user.name}'s profile picture`}
        className={styles.profilePicture}
        onError={handleImageError}
      />
      <span className={styles.userName}>{user.name}</span>
    </div>
  );
}