import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import { Link, Route, Routes } from 'react-router-dom'
import Header from './component/Header'
import Footer from './component/Footer'
import ProductPage from './pages/Products/ProductPage'
import ProductDetailPage from './pages/ProductsDetail/ProductDetailPage'
import ShoppingCartPage from './pages/Cart/ShoppingCartPage'
 import CustomerCare from './pages/CustomerCare/CustomerCare'
import BlogPage from './pages/Blog/BlogPage'
import ProfilePage from './pages/Profile/ProfilePage'
import OrderConfirmationPage from './pages/Orderdetail/OrderConfirmationPage'


function App() {

  return (
    <>
      <Header/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
         <Route path="/customer-care" element={<CustomerCare />} />
         <Route path="/blog" element={<BlogPage />} />
         <Route path="/profile" element={<ProfilePage />} />
         <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
