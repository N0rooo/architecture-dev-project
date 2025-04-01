import { ScratchToReveal } from '@/components/magicui/scratch-to-reveal'
import React from 'react'
import CashprizeView from './_views/cashprizeView'

export default function page() {
  return (
    <section className='flex flex-col items-center justify-center gap-4 mt-4'>
      <h1 className='text-5xl font-bold'>Prize</h1>
      <div className='flex items-center justify-center'>
        <CashprizeView />
      
    </div>
    </section>
  )
}
