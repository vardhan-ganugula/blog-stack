import { MdDashboard, MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { BsFilePost } from "react-icons/bs";
import { RiDraftFill } from "react-icons/ri";

export const navLinks = [
    {
        name: 'Home',
        link : '/',
    },
    {
        name: 'About',
        link : 'https://github.com/vardhan-ganugula/blog-stack',
    },
    {
        name: 'Blog',
        link : '/blog',
    },
]

export const dashboardLinks = [
    {
        name: 'Dashboard',
        link : '/dashboard',
    },
    {
        name: 'Blog',
        link : '/blog',
    },
    {
        name: 'Profile',
        link : '/profile',
    },
]


export const sideBarLinks = [
    {
        name: 'Dashboard',
        link : '/dashboard',
        icon: MdDashboard
    },
   
    {
        name: 'Posts',
        link : '/posts',
        icon: BsFilePost
    },
    {
        name: 'Drafts',
        link : '/drafts',
        icon: RiDraftFill 
    },
     {
        name: 'Profile',
        link : '/profile',
        icon: CgProfile
    },
    {
        name: 'Logout',
        link : '/logout',
        icon: MdLogout
    },
]