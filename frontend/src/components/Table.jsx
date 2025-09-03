export default function Table({ data, columns }) {
  return (
    <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col, idx) => (
            <th key={idx} className="border p-2">{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            {columns.map((col, i) => (
              <td key={i} className="border p-2">{row[col.accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
