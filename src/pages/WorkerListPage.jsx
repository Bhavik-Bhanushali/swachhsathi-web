import './WorkerListPage.css';



const WorkerListPage = () => {
    const workers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    status: 'active',
    meta: '2 mins ago',
  },
  {
    id: 2,
    name: 'Amit Singh',
    status: 'active',
    meta: '1 task active',
  },
  {
    id: 3,
    name: 'Priya Sharma',
    status: 'active',
    meta: '1 task active',
  },
  {
    id: 4,
    name: 'Vikram Patel',
    status: 'active',
    meta: '1 task active',
  },
  {
    id: 5,
    name: 'Sunesh Yadav',
    status: 'inactive',
    meta: '5 hours ago',
  },
  {
    id: 6,
    name: 'Ravi Mehta',
    status: 'inactive',
    meta: 'Available',
  },
];

const statusConfig = {
  active: {
    label: 'Active',
    dotClass: 'dot-active',
  },
  inactive: {
    label: 'Inactive',
    dotClass: 'dot-inactive',
  }
};
  return (
    <div className="worker-page">
      {/* Active Workers Container */}
      <div className="worker-card">
        <div className="worker-header">
          <h2>Active Workers</h2>
          <span className="worker-subtitle">Currently online and available</span>
        </div>

        <div className="worker-list">
          {workers.filter(worker => worker.status === 'active').map((worker) => (
            <div key={worker.id} className="worker-row">
              <div className="worker-left">
                <div className="worker-avatar">
                  {worker.name.charAt(0)}
                </div>

                <div className="worker-info">
                  <p className="worker-name">{worker.name}</p>
                </div>
              </div>

              <div className="worker-status">
                <span
                  className={`status-dot ${statusConfig[worker.status].dotClass}`}
                />
                <span className="status-label">
                  {statusConfig[worker.status].label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inactive Workers Container */}
      <div className="worker-card">
        <div className="worker-header">
          <h2>Inactive Workers</h2>
          <span className="worker-subtitle">Currently offline or unavailable</span>
        </div>

        <div className="worker-list">
          {workers.filter(worker => worker.status === 'inactive').map((worker) => (
            <div key={worker.id} className="worker-row">
              <div className="worker-left">
                <div className="worker-avatar">
                  {worker.name.charAt(0)}
                </div>

                <div className="worker-info">
                  <p className="worker-name">{worker.name}</p>
                </div>
              </div>

              <div className="worker-status">
                <span
                  className={`status-dot ${statusConfig[worker.status].dotClass}`}
                />
                <span className="status-label">
                  {statusConfig[worker.status].label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerListPage;
