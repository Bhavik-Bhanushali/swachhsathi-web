import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateWorkerForm from '../components/CreateWorkerForm';
import { useWorkers } from '../../firebase/hooks/useWorker';
import { useAuth } from '../context/AuthContext';
import './WorkerListPage.css';
import { UserPlus } from 'lucide-react';



const WorkerListPage = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: workers, isLoading, error } = useWorkers(user?.uid);

    useEffect(() => {
        console.log('Workers count:', workers?.length || 0);
        // console.log('NGO ID:', user?.uid);
        // console.log('Workers:', workers);
    },[workers, user]);

    const handleWorkerClick = (workerId) => {
        console.log(workerId);
        
        navigate(`/worker/${workerId}`);
    };

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

  if (isLoading) {
    return (
      <div className="worker-page">
        <div className="worker-page-header">
          <h1>Worker Management</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading workers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="worker-page">
        <div className="worker-page-header">
          <h1>Worker Management</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          Error loading workers: {error.message}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setIsPopupOpen(false)}>
              ×
            </button>
            <CreateWorkerForm />
          </div>
        </div>
      )}

      <div className="worker-page">
        {/* Add Worker Button */}
        <div className="worker-page-header">
          <h1>Worker Management</h1>
          <button className="add-worker-btn" onClick={() => setIsPopupOpen(true)}>
            <UserPlus size={20} className="add-worker-icon" />
            Add New Worker
          </button>
        </div>

        <div className="worker-cards-container">
          {/* Active Workers Container */}
          <div className="worker-card">
        <div className="worker-header">
          <h2>Active Workers</h2>
          <span className="worker-subtitle">Currently online and available</span>
        </div>

        <div className="worker-list">
          {workers && workers.length > 0 ? (
            workers.filter(worker => worker.isActive === true).length > 0 ? (
              workers.filter(worker => worker.isActive === true).map((worker) => (
                <div 
                  key={worker.id} 
                  className="worker-row"
                  onClick={() => handleWorkerClick(worker.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="worker-left">
                    <div className="worker-avatar">
                      {worker.name?.charAt(0) || 'W'}
                    </div>

                    <div className="worker-info">
                      <p className="worker-name">{worker.name}</p>
                    </div>
                  </div>

                  <div className="worker-status">
                    <span
                      className={`status-dot ${statusConfig[worker.status]?.dotClass || 'dot-inactive'}`}
                    />
                    <span className="status-label">
                      {statusConfig[worker.status]?.label || 'Unknown'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
                No active workers
              </div>
            )
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
              No workers available
            </div>
          )}
        </div>
      </div>

      {/* Inactive Workers Container */}
      <div className="worker-card">
        <div className="worker-header">
          <h2>Inactive Workers</h2>
          <span className="worker-subtitle">Currently offline or unavailable</span>
        </div>

        <div className="worker-list">
          {workers && workers.length > 0 ? (
            workers.filter(worker => worker.isActive === false || worker.isActive === null).length > 0 ? (
              workers.filter(worker => worker.isActive === false || worker.isActive === null).map((worker) => (
                <div key={worker.id} className="worker-row" onClick={() => handleWorkerClick(worker.id)} style={{ cursor: 'pointer' }}>
                  <div className="worker-left">
                    <div className="worker-avatar">
                      {worker.name?.charAt(0) || 'W'}
                    </div>

                    <div className="worker-info">
                      <p className="worker-name">{worker.name}</p>
                    </div>
                  </div>

                  <div className="worker-status">
                    <span
                      className={`status-dot ${statusConfig[worker.status]?.dotClass || 'dot-inactive'}`}
                    />
                    <span className="status-label">
                      {statusConfig[worker.isActive ? 'active' : 'inactive']?.label || 'Unknown'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
                No inactive workers
              </div>
            )
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
              No workers available
            </div>
          )}
        </div>
      </div>
        </div>
      </div>
    </>
  );
};

export default WorkerListPage;
