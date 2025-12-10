export default function AnalyticsTable() {
  return (
    <div className="shadow rounded-xl p-4">
      <header>
        <h2 className="text-sm font-semibold">Orders Made</h2>
        <p className="text-sm text-gray-500">All orders made during the day</p>
      </header>

      <div className="divider"></div>

      <select defaultValue="" className="select select-sm mb-4">
        <option disabled={true}>Select Sales Agent</option>
        <option>Crimson</option>
        <option>Amber</option>
        <option>Velvet</option>
      </select>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Order Details</th>
              <th>Grand Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>
                <p>Quantum Item QTY: 3 - P12,000.21</p>
                <br />
                <p>Quantum Item QTY: 3 - P12,000.21</p>
              </td>
              <td>12,000.21</td>
              <td>APPROVED</td>
            </tr>
            <tr>
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Zemlak, Daniel and Leannon</td>
              <td>United States</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
