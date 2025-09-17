export default function ApplicationList({ items, meta, onDelete, onUpdate, params, setParams }) {
    const next = () => {
      if (params.page < meta.pages) setParams(p => ({ ...p, page: p.page + 1 }));
    };
    const prev = () => {
      if (params.page > 1) setParams(p => ({ ...p, page: p.page - 1 }));
    };
  
    return (
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Applications</h2>
          <div className="text-sm text-slate-600">
            {meta.total} results · page {meta.page}/{meta.pages}
          </div>
        </div>
        <ul className="space-y-2">
          {items.map(app => (
            <li key={app.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{app.company} — {app.position}</div>
                <div className="text-sm text-slate-600">
                  {app.status} · {app.applied_date || "no date"} · score {app.resume_match_score ?? "-"}
                </div>
                {app.notes && <div className="text-sm mt-1">{app.notes}</div>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdate(app.id, { status: "Interview" })}
                  className="px-2 py-1 text-sm rounded border"
                >Set Interview</button>
                <button
                  onClick={() => onDelete(app.id)}
                  className="px-2 py-1 text-sm rounded bg-red-600 text-white"
                >Delete</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-4">
          <button className="px-3 py-1 rounded border" onClick={prev} disabled={params.page <= 1}>Prev</button>
          <button className="px-3 py-1 rounded border" onClick={next} disabled={params.page >= meta.pages}>Next</button>
        </div>
      </div>
    );
  }
  