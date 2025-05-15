import React from 'react'
import Title from '../Components/Title';
import { assets } from '../assets/assets'
import NewsLatterBox from '../Components/NewsLatterBox';

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
      <img className='w-full md:max-w-[450px]' src ={assets.about_img} alt=""/>
      <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
       <p>Welcome to Life Fashion Shop!
Your one-stop destination for trendy, high-quality, and affordable fashion. We are passionate about helping customers express their style with the latest clothing, footwear, and accessories for every occasion. Our carefully curated collection ensures top-notch quality, comfort, and affordability, making it easier for everyone to find the perfect outfit.</p>
       <p>At Life Fashion Shop, we prioritize customer satisfaction by offering a seamless shopping experience, secure payments, and reliable order tracking. Whether you’re looking for casual wear, formal attire, or seasonal trends, our expanding range of fashion products is designed to keep you stylish and confident. Join us and elevate your wardrobe with the best in fashion!</p>
      <b className='text-gray-800'>Our Mission</b>
      <p>At Life Fashion Shop, our mission is to provide high-quality, stylish, and affordable clothing while ensuring a seamless shopping experience. We aim to empower customers with fashion that fits their personality and lifestyle. Committed to customer satisfaction, innovation, and reliability, we make it easy for fashion lovers to access the latest trends. Through continuous growth and excellence in service, we strive to be the go-to destination for all fashion needs.   </p>
      
      </div>
      </div>
      <NewsLatterBox/>
    </div>
  )
}

export default About