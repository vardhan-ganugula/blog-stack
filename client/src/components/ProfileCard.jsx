import React from "react";
import { FaCalendar, FaShieldCat } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { MdMonitorHeart } from "react-icons/md";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/Axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";

const ProfileCard = () => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: user.username,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.profilePicture,
    createdAt: user.createdAt,
    sessions:  [],
  });
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const styles = {
    card: {
      maxWidth: "400px",
      margin: "20px auto",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      overflow: "hidden",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "32px 24px",
      textAlign: "center",
      color: "white",
    },
    avatarContainer: {
      position: "relative",
      display: "inline-block",
      marginBottom: "16px",
    },
    avatar: {
      width: "96px",
      height: "96px",
      borderRadius: "50%",
      border: "4px solid white",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
      objectFit: "cover",
    },
    statusIndicator: {
      position: "absolute",
      bottom: "4px",
      right: "4px",
      width: "24px",
      height: "24px",
      backgroundColor: "#10b981",
      borderRadius: "50%",
      border: "2px solid white",
    },
    userName: {
      fontSize: "24px",
      fontWeight: "bold",
      margin: "0 0 4px 0",
    },
    username: {
      fontSize: "16px",
      opacity: "0.8",
      margin: "0",
    },
    content: {
      padding: "24px",
    },
    field: {
      display: "flex",
      alignItems: "center",
      marginBottom: "20px",
      padding: "12px",
      backgroundColor: "#f8fafc",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
    },
    fieldIcon: {
      marginRight: "12px",
      color: "#64748b",
      flexShrink: 0,
    },
    fieldContent: {
      flex: 1,
    },
    fieldLabel: {
      fontSize: "12px",
      color: "#64748b",
      textTransform: "uppercase",
      fontWeight: "600",
      letterSpacing: "0.5px",
      margin: "0 0 4px 0",
    },
    fieldValue: {
      fontSize: "14px",
      color: "#1e293b",
      fontWeight: "500",
      margin: "0",
    },
    sessionsTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1e293b",
      margin: "0 0 16px 0",
      display: "flex",
      alignItems: "center",
    },
    sessionsList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
    },
    sessionItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px",
      backgroundColor: "#f8fafc",
      borderRadius: "8px",
      marginBottom: "8px",
      border: "1px solid #e2e8f0",
    },
    sessionInfo: {
      flex: 1,
    },
    sessionDevice: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#1e293b",
      margin: "0 0 4px 0",
    },
    sessionTime: {
      fontSize: "12px",
      color: "#64748b",
      margin: "0",
    },
    sessionStatus: {
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500",
    },
    activeStatus: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    inactiveStatus: {
      backgroundColor: "#f1f5f9",
      color: "#475569",
    },
  };

  useEffect(() => {
    const getUserSessions = async () => {
      setLoading(true);
      try {
        const data = await axiosInstance.get("/sessions");
        setUserData(prev => (
            { ...prev, sessions: data.data.sessions }
        ))
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getUserSessions();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.avatarContainer}>
              <img src={userData.avatar} alt="Profile" style={styles.avatar} />
              <div style={styles.statusIndicator}></div>
            </div>
            <h2 style={styles.userName}>{userData.name}</h2>
            <p style={styles.username}>@{userData.username}</p>
          </div>

          <div style={styles.content}>
            <div style={styles.field}>
              <IoIosMail style={styles.fieldIcon} size={18} />
              <div style={styles.fieldContent}>
                <p style={styles.fieldLabel}>Email</p>
                <p style={styles.fieldValue}>{userData.email}</p>
              </div>
            </div>

            <div style={styles.field}>
              <FaShieldCat style={styles.fieldIcon} size={18} />
              <div style={styles.fieldContent}>
                <p style={styles.fieldLabel}>Role</p>
                <p style={styles.fieldValue}>{userData.role}</p>
              </div>
            </div>

            <div style={styles.field}>
              <FaCalendar style={styles.fieldIcon} size={18} />
              <div style={styles.fieldContent}>
                <p style={styles.fieldLabel}>Member Since</p>
                <p style={styles.fieldValue}>
                  {formatDate(userData.createdAt)}
                </p>
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <h3 style={styles.sessionsTitle}>
                <MdMonitorHeart style={{ marginRight: "8px" }} size={18} />
                Active Sessions
              </h3>
              <ul style={styles.sessionsList}>
                {userData.sessions.map((session) => (
                  <li key={session._id} style={styles.sessionItem}>
                    <div style={styles.sessionInfo}>
                      <p style={styles.sessionDevice}>{session.device}</p>
                      <p style={styles.sessionTime}>
                        Last active: {session.lastActive}
                      </p>
                    </div>
                    <span
                      style={{
                        ...styles.sessionStatus,
                        ...(session.valid
                          ? styles.activeStatus
                          : styles.inactiveStatus),
                      }}
                    >
                      {session.valid ? "Active" : "Inactive"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;
