"use client"
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { Fascinate } from 'next/font/google'
import SignaturePad from './drawingpad'
import BiselcoMap from '@/app/complaints/components/Map'
const facinate = Fascinate({ display: 'swap', subsets: ['latin'], weight: '400' })

const ChangeMeterForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  return (
    <div className='flex justify-center mx-2'>
      <fieldset className="fieldset justify-around items-center bg-base-200 border-base-300 rounded-box w-sm border p-4">
        <legend className={`fieldset-legend text-3xl font-bold ${facinate.className} text-blue-900 text-shadow-md text-shadow-amber-400`}>Change Meter Form</legend>
        <form className='flex flex-col gap-4 max-h-[70vh]  overflow-y-scroll'>
          <label className='label font-bold'> Date Accomplished </label>
          <DatePicker
            required
            showIcon
            showMonthDropdown
            showYearDropdown
            selected={selectedDate}
            onChange={setSelectedDate}
            todayButton="Today"
            dateFormat="YYYY-MM-dd"
            calendarIconClassName={"absolute left-1 top-1/2 transform -translate-y-1/2"}
            className="border-gray-300 border-2 rounded-full  h-9 w-full bg-base-100"
            calendarClassName='glass rounded-box px-4 py-2 w-full'
            placeholderText="Select Date Accomplished"
          />

          <label className="label font-bold">Consumer Name</label>
          <div className='flex gap-2'>
            <input type="text" className="input w-full" placeholder="Consumer Name" />
            <button type='button' title='Verify Consumer' className='btn btn-circle drop-shadow-md'>
              <svg
                fill="#000000"
                width="64px"
                height="64px"
                viewBox="0 -8 72 72"
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier"
                  strokeWidth={0}>
                </g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                </g>
                <g id="SVGRepo_iconCarrier">
                  <title>search</title>
                  <path d="M58.73,44.35l-11-11a21.26,21.26,0,0,1-6.37,6.37l11,11a4.51,4.51,0,0,0,6.38-6.38Z">
                  </path>
                  <path d="M48,22A18,18,0,1,0,30,40,18,18,0,0,0,48,22ZM30,35.52A13.53,13.53,0,1,1,43.52,22,13.55,13.55,0,0,1,30,35.52Z">
                  </path>
                  <path d="M19.47,22h3A7.52,7.52,0,0,1,30,14.47v-3A10.53,10.53,0,0,0,19.47,22Z">
                  </path>
                </g>
              </svg>
            </button>
          </div>

          <div className='flex flex-col gap-2'>
            <label className="label font-bold">Existing Meter</label>
            <input type="text" className="input w-full" placeholder="Pullout Meter (Brand | Serial Number)" />
            <input type="number" className="input w-full" placeholder="Pullout Reading" />
          </div>

          <div className='flex flex-col gap-2 '>
            <label className="label font-bold ">New Meter</label>
            <input required type="text" className="input w-full" placeholder="Brand" />
            <input required type="text" className="input w-full" placeholder="Serial Number" />
            <input required type="number" className='input w-full' placeholder='Meter Sealed' />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='label font-bold'>Remarks</label>
            <textarea className="textarea w-full" placeholder="Remarks"></textarea>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='label font-bold'>Signatory</label>
            <input type="text" className="input w-full" placeholder="Accomplished By" />
            <input type="text" className="input w-full" placeholder="Submitted By" />
          </div>

         
          <div className="flex flex-col gap-2 overflow-visible">
            <div tabIndex={0} className='collapse collapse-arrow bg-base-100 border-base-300 border'>
            <div className="collapse-title font-semibold">
              <label className='label font-bold'>Location</label>
            </div>
            <div className="collapse-content">
              <BiselcoMap />
            </div>
          </div>

          </div>
          
          <button type='submit' className='btn btn-success mt-2'>Submit</button>
        </form>
      </fieldset>
    </div>
  )
}

export default ChangeMeterForm