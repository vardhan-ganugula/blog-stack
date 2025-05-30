import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/css/dashboard.css";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getDrafts } from "../store/blog";
const Dashboard = () => {
  const username = useSelector((state) => state.auth.user.username);
  const posts =
    useSelector((state) => state.blog.blogPosts).filter(
      (blog) => blog.author === username
    ) || [];
  const drafts = useSelector((state) => state.blog.drafts) || [];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDrafts());
  }, []);

  return (
    <DashboardLayout>
      <div>
        <div className="dashbord__posts__stats">
          <div className="stat__box">
            <span className="stat__title">Contribution </span>
            <span className="stat__count">{posts.length + drafts.length}</span>
          </div>
          <div className="stat__box">
            <span className="stat__title">Total Posts </span>
            <span className="stat__count">{posts.length}</span>
          </div>

          <div className="stat__box">
            <span className="stat__title">Total Drafts </span>
            <span className="stat__count">{drafts.length}</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
