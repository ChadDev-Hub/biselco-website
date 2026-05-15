import React from 'react';
import { User,  Clock,  History, Send } from 'lucide-react';



const ConcernCard = () => {
  const ticketData = {
  firstName: "John",
  lastName: "Doe",
  submittedAt: "May 15, 2026, 10:30 AM",
  subject: "API Connection Issue",
  refPole: "NY-88",
  resolutionTime: "Estimated 4 hours",
  status: "Under Review",
  details: "The form won't submit despite valid input fields. Need billing inquiry support."
};
  const ticket = ticketData;
  return (
    <div className="max-w-4xl mx-auto bg-base-100 rounded-2xl shadow-lg border border-slate-200 overflow-hidden font-sans">
      {/* Header Section */}
      <div className="bg-base-200 p-6 border-b border-slate-100 flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <User className="text-blue-600" size={32} />
        </div>
        <div>
          <p className="text-xs font-bold text-blue-400 tracking-widest uppercase">Profile Ticket</p>
          <h2 className="text-2xl font-bold text-slate-800">
            {ticket.firstName} {ticket.lastName}
          </h2>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Metadata */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase">Submitted At</span>
            <span className="text-slate-700">{ticket.submittedAt}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase">Subject</span>
            <span className="text-slate-700 font-medium">{ticket.subject}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase">Ref Pole</span>
            <span className="text-slate-700">{ticket.refPole}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase">Resolution Time</span>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock size={16} />
              <span>{ticket.resolutionTime}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Status & History */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-md font-bold text-sm uppercase">
              {ticket.status}
            </span>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <History size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase">Status History</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div> Created
              </li>
              <li className="flex items-center gap-2 text-blue-600 font-medium">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div> Under Review
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div> In Progress
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs & Details Section */}
      <div className="px-6 pb-6">
        <div className="flex gap-4 border-b border-slate-100 mb-4 text-xs font-bold text-slate-400 uppercase">
          <button className="pb-2 border-b-2 border-blue-600 text-blue-600">Details</button>
          <button className="pb-2 hover:text-slate-600">Map Image</button>
          <button className="pb-2 hover:text-slate-600">Messages</button>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-lg text-slate-600 text-sm italic border border-slate-100">
          {ticket.details}
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-6 bg-slate-50 flex flex-wrap justify-end gap-3">
        <button className="px-6 py-2 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition">
          View Messages
        </button>
        <button className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold flex items-center gap-2 hover:bg-blue-700 transition">
          <Send size={18} />
          Submit Updates
        </button>
      </div>
    </div>
  );
};

export default ConcernCard;