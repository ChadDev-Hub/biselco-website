import React from 'react';
import {   Clock,  History} from 'lucide-react';
import Image from 'next/image';
import ImageViewer from '../../technical/change-meter/components/imageViewr';
import { Complaints } from '../../../../types/complaints';


type Props = {
  userComplaint: Complaints;
  timeLine: React.ReactNode;
  deleteTool?: React.ReactNode;
  toolsComponent: React.ReactNode;
  mapViewer: React.ReactNode; 
}



const ConcernCard = ({userComplaint, timeLine, toolsComponent, mapViewer, deleteTool}: Props) => {
  return (
    <div className="max-w-lg w-full border-t-2 border-t-blue-600 border-b-yellow-500 border-b-2 card relative mx-auto bg-base-100 rounded-2xl shadow-lg border border-gray-300 overflow-hidden font-sans">
        {deleteTool}        
      {/* Header Section */}
      <div className="bg-base-200  max-h-15 p-6 border-b border-slate-100 flex items-center gap-4">
        <div className="bg-blue-100 ava avatar avatar-xs border p-3 rounded-full">
          <Image
          src={userComplaint.user_photo}
          fill
          alt="Profile"
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className="rounded-full ring-primary ring-offset-base-100 w-24 ring-2 ring-offset-2"/>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            {userComplaint.first_name} {userComplaint.last_name}
          </h2>
        </div>
      </div>
      {/* Card Body */}
      <div className="p-6 card-body card-border grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Left Column: Metadata */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase">Submitted At</span>
            <span className="text-slate-700 text-xs">{userComplaint.date_time_submitted}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase">Subject</span>
            <span className="text-slate-700 text-xs">{userComplaint.subject}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase">Ref Pole</span>
            <span className="text-slate-700 text-xs">{userComplaint.reference_pole}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase">Resolution Time</span>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock size={16} />
              <span className="text-xs">{userComplaint.resolution_time}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase">Location</span>
            <div className="flex items-center gap-2 text-slate-700">
              {mapViewer}
              <span className="text-xs">{userComplaint.village} {userComplaint.municipality}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase">Image</span>
            {userComplaint.images && <ImageViewer image={userComplaint.images[0].url}/>}
          </div>
        </div>

        {/* Right Column: Status & History */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-md font-bold text-sm uppercase">
              {userComplaint.latest_status?.name}
            </span>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <History size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase">Status History</span>
            </div>
            {timeLine}
          </div>
        </div>
      </div>

      {/* Tabs & Details Section */}
      <div className="px-6 pb-6">
        <div className="bg-slate-50 text-xs p-4 rounded-lg text-slate-600  italic border border-slate-100">
          {userComplaint.description}
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-6 w-full card-actions bg-base-200 flex flex-wrap justify-end gap-3">
        {toolsComponent}
      </div>
    </div>
  );
};

export default ConcernCard;