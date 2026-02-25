import './App.css'
import Login from "./Pages/Login.jsx";
import { Routes, Route } from "react-router-dom";
import {ToastContainer} from "react-toastify";
import Home from "./Pages/Home.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import useUserProfile from "./Hooks/userProfile.jsx";
import {useSelector} from "react-redux";
import Register from "./Pages/Register.jsx";
import Pagenotfound from "./redux/Pagenotfound.jsx";
import BookingDetail from "./Pages/BookingDetail.jsx";
import AssetManagement from "./Pages/AssetManagment.jsx";
import EmployeeAssetPortal from "./Pages/EmployeeAssetPortal.jsx";
import RequestManagment from "./Pages/RequestManagment.jsx";

function App() {

  useUserProfile();

  const {userData}=useSelector(state => state.user);

  return (
         <>
            <Routes>

                <Route path="/" element={userData ? <Home/> : <Login/>}>

                    <Route index element={<Dashboard/>} />

                    <Route path="/register" element={ userData?.role==="ROLE_ADMIN" ? <Register/> : <Pagenotfound/>} />
                    <Route path="/bookingdetail" element={ userData?.role==="ROLE_ADMIN" ? <BookingDetail/> : <Pagenotfound/>} />
                    <Route path="/assetmanagment" element={ userData?.role==="ROLE_ADMIN" ? <AssetManagement/> : <Pagenotfound/>} />
                    <Route path="/employasstportal" element={ userData?.role==="EMPLOYEE" ? <EmployeeAssetPortal/> : <Pagenotfound/>} />
                    <Route path="/requestmanagment" element={userData?.role==="ITSUPPORT" ?<RequestManagment/>: <Pagenotfound/>} />
                </Route>
                <Route path="/login" element={<Login/>} />
            </Routes>
             <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
         </>


    )
}

export default App
