import React from 'react'
import { assets } from '../assets/assets'

export const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <img src={assets.logo2} className='mb-5 w-26' alt="" />
                <p className='w-full md:w-2/3 text-gray-600'>Explore the latest trends with Life Fashion Clothing Store. We offer high-quality, stylish apparel to keep you looking your best. Stay connected with us through our social media channels and subscribe to our newsletter for exclusive deals and updates. Need assistance? Contact our support team anytime. Shop with confidence—fashion made for you!"</p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5' >COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    {/* change the email and password */}
                    <li>0725010436</li>
                    <li>oshadarox17@gmail.com</li>
                </ul>
            </div>

        </div>
        <div>
            <hr />
            <p className='py-5 text-sm text-center '>Copyright 2025@ LifeFashion.com - All Right Reserved</p>
        </div>
    </div>
  )
}
