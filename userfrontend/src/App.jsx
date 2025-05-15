import React from "react";
import { Routes, Route } from "react-router-dom";

import Collection from "./Pages/Collection";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import PlaceOrder from "./Pages/PlaceOrder";
import Order from "./Pages/Order";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import { Footer } from "./Components/Footer";
import Searchbar from "./Components/Searchbar";
import { ToastContainer, toast } from "react-toastify";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyOTP from "./Pages/VerifyOTP";
import ResetPassword from "./Pages/ResetPassword";
import Verify from "./Pages/Verify";

import AddDelivery from "./Components/AddDelivery/AddDelivery";
import Deliverys from "./Components/Deliverydetails/Deliverys";
import UpdateDelivery from "./Components/UpdateDelivery/UpdateDelivery";

import ReturnPage from "./Pages/ReturnPage";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px[7vw] lg:px[9vw]">
      <ToastContainer />
      <Navbar />
      <Searchbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mainhome" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/placeOrder" element={<PlaceOrder />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/return" element={<ReturnPage />} />
        {/* Add your new routes here */}
        <Route path="/adddelivery" element={<AddDelivery />} />
        <Route path="/deliverydetails" element={<Deliverys />} />
        <Route path="/deliverydetails/:id" element={<UpdateDelivery />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
