import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import { setTheme } from "./store/theme";
import { useDispatch } from "react-redux";
import Header from "./components/Header";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { checkAuth } from "./store/auth";
import Verify from "./pages/Verify";
import SendVerification from "./pages/SendVerification";
import Blogpage from "./pages/Blogpage";
import BlogPost from "./pages/BlogPost";
import Posts from "./pages/Posts";
import { getBlogs } from "./store/blog";
import DraftPage from "./pages/DraftPage";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    dispatch(setTheme(theme));
  }, []);
  useEffect(()=>{
    dispatch(checkAuth());
    dispatch(getBlogs());
  },[dispatch])
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/verify/" element={<Verify />} />
        <Route path="/verify-email" element={<SendVerification />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/drafts" element={<DraftPage />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
        <Route path="/blog" element={<Blogpage />} />
        <Route path="/blog/:slug" element={<BlogPost/>} />
      </Routes>
    </>
  );
}

export default App;
