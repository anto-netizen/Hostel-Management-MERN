export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Hostel Management</h1>
      <div className="flex gap-4">
        <a href="/hostels" className="hover:underline">Hostels</a>
        <a href="/buildings" className="hover:underline">Buildings</a>
        <a href="/students" className="hover:underline">Students</a>
        <a href="/rooms" className="hover:underline">Rooms</a>
        <a href="/roomtypes" className="hover:underline">Room Types</a>
      </div>
    </nav>
  );
}
