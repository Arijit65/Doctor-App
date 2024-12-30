import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
       <p>ABOUT <span className='text-gray-700 font-medium '>US</span></p> 
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>As the sun sets, the city's skyline transforms into a glittering expanse of lights, each building illuminated like a jewel in a crown. In this vibrant metropolis, there is a sense of endless possibility, where every corner turned reveals a new adventure waiting to be experienced</p>
          <p>In the heart of the bustling city, amidst the symphony of car horns and the chatter of pedestrians, there lies a tranquil oasis known as Green Haven Park. This sprawling green space is a sanctuary for those seeking a brief respite from the urban chaos. With its meticulously manicured lawns</p>
          <b className='text-gray-800'>Our vissiuon</b>
          <p>Our vissiuon stands as a testament to the beauty and resilience of nature. Under its sprawling branches, visitors often find solace, gathering for picnics, yoga sessions, or simply to bask in the shade with a good book.</p>
        </div>
      </div >
      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHHOOSE US</span></p>
        <div className='flex flex-col md:flex-row mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>
              Efficiecy
            </b>
            <p>
            oasis known as Green Haven Park. This sprawling green space is a sanctuary for those seeking
            </p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>
                convinience
            </b>
            <p>
            a majestic oak tree, stands as a testament to the beauty and resilience of nature. Under its sprawling branches,
            </p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>
              preservece
            </b>
            <p>
            mingles with the aroma of street food, creating an irresistible invitation for both locals and tourists alike
            </p>
          </div>

        </div>
      </div>


    </div>
  )
}

export default About