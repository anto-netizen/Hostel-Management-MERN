import { useEffect, useState } from "react";
import { getHostels, createHostel } from "../services/hostelService";
import Table from "../components/Table";

export default function Hostels() {
  const [hostels, setHostels] = useState([]);
  const [newHostel, setNewHostel] = useState({ hostelName: "", studentAdmissionFee: 0 });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    const res = await getHostels();
    setHostels(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createHostel(newHostel);
    setNewHostel({ hostelName: "", studentAdmissionFee: 0 });
    fetchHostels();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Hostels</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Hostel Name"
          value={newHostel.hostelName}
          onChange={(e) => setNewHostel({ ...newHostel, hostelName: e.target.value })}
          className="border p-2 rounded w-1/3"
        />
        <input
          type="number"
          placeholder="Admission Fee"
          value={newHostel.studentAdmissionFee}
          onChange={(e) => setNewHostel({ ...newHostel, studentAdmissionFee: e.target.value })}
          className="border p-2 rounded w-1/3"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      <Table
        data={hostels}
        columns={[
          { header: "ID", accessor: "hostelId" },
          { header: "Name", accessor: "hostelName" },
          { header: "Admission Fee", accessor: "studentAdmissionFee" },
        ]}
      />
    </div>
  );
}
