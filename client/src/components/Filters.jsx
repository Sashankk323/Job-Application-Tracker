export default function Filters({ params, setParams }) {
    const set = (k, v) => setParams(p => ({ ...p, [k]: v, page: 1 }));
  
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Filters</h2>
        <input className="border w-full p-2 rounded mb-2" placeholder="Search (company/position)"
          value={params.q} onChange={e => set("q", e.target.value)} />
        <select className="border w-full p-2 rounded mb-2"
          value={params.status} onChange={e => set("status", e.target.value)}>
          <option value="">Any status</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Offer</option>
        </select>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" type="date" value={params.from} onChange={e => set("from", e.target.value)} />
          <input className="border p-2 rounded" type="date" value={params.to} onChange={e => set("to", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select className="border p-2 rounded" value={params.sortBy} onChange={e => set("sortBy", e.target.value)}>
            <option value="applied_date">Applied date</option>
            <option value="status">Status</option>
            <option value="company">Company</option>
            <option value="position">Position</option>
            <option value="resume_match_score">Match score</option>
            <option value="id">ID</option>
          </select>
          <select className="border p-2 rounded" value={params.order} onChange={e => set("order", e.target.value)}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>
    );
  }
  