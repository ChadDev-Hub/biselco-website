import React from "react";
import CardComponent from "@/app/common/card";
import DashBoardTable from "@/app/common/table";

type Member = {
  id: number;
  name: string;
  location: string;
  members: number;
  status: "Active" | "Pending";
  joinDate: string;
};

type Props = {
  members: Member[];
};

const MembersTable: React.FC<Props> = ({ members }) => {
  return (
    <CardComponent className="p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">AGMA Members</h2>
      <DashBoardTable>
        <thead>
          <tr className="bg-gray-100">
            <th>AGMA Name</th>
            <th>Location</th>
            <th>Members</th>
            <th>Status</th>
            <th>Join Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50">
              <td className="font-semibold text-gray-800">{member.name}</td>
              <td>{member.location}</td>
              <td>
                <span className="badge badge-lg badge-outline">{member.members}</span>
              </td>
              <td>
                <span
                  className={`badge ${
                    member.status === "Active" ? "badge-success" : "badge-warning"
                  }`}
                >
                  {member.status}
                </span>
              </td>
              <td className="text-sm text-gray-600">{member.joinDate}</td>
              <td>
                <button className="btn btn-sm btn-outline btn-primary">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </DashBoardTable>
    </CardComponent>
  );
};

export default MembersTable;
