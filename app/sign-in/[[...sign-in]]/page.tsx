import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return (
    <div className='flex justify-center p-5'>
        <SignIn/>
    </div>
  )
}

export default Page