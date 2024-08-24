// src/app/components/Notifications.js
import { useEffect, useState } from 'react';
import { db } from '../../supabase';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'notifications', userId, 'userNotifications'),
      (snapshot) => {
        const notifData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notifData);
      },
      (err) => {
        console.error("Error fetching notifications: ", err);
        setError(err.message);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  if (error) {
    return <div>Error loading notifications: {error}</div>;
  }

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notif) => (
          <li key={notif.id}>{notif.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
