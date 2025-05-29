import React, { useEffect } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { useParams, useNavigate } from "react-router-dom";
import axios from '../utils/Axios';
import { toast } from "react-toastify";

const Verify = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`/auth/verify-email?token=${token}`);
                if(response.data.status === 1) {
                    toast.success("Email verified successfully");
                    navigate("/login");
            }
            } catch (error) {
                console.log(error)
                toast.error("Invalid or expired token");
            }
        }
        verifyEmail();
    }, [token])
  return (
    <AuthLayout>
      <main>
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
        }}>
            <div className="card">
                <div className="card__header">
                    <h2 style={{
                        fontSize: "1.4rem"
                    }}>Verify your email</h2>
                </div>
                <div className="card__body"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "start",
                        gap: "1rem",
                        fontSize: ".9rem",
                    }}
                >
                    <p>Token : <span>{token}</span></p>
                    <p></p>
                    <button className="btn btn-primary"
                        onClick={() => {
                            navigate("/verify-email")
                        }}
                    >Resend Verification Email</button>
                </div>
            </div>
        </div>
      </main>
    </AuthLayout>
  );
};

export default Verify;
