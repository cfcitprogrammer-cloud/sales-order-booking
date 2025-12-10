export default function QuickSummaryTable() {
  return (
    <div className="shadow p-4 rounded-xl">
      <div>
        <h1 className="text-sm font-semibold">Quick Summary</h1>
        <p className="text-gray-600 text-sm">
          Total orders made by each sales agent
        </p>
      </div>
      <div className="divider"></div>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Pending Orders</th>
              <th>Total Orders Made</th>
              <th>Total Earnings Made</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>1</td>
              <td>11</td>
              <td>120,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
