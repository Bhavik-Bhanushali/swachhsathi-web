import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import WorkerService from '../services/WorkerService';

const WORKER_KEYS = {
    all: ['workers'],
    byNgo: (ngoId) => ['workers', ngoId],
};

export const useWorker = () => {
    const queryClient = useQueryClient();

    // Mutation to create a new worker
    const createWorkerMutation = useMutation({
        mutationFn: (workerData) => WorkerService.createWorker(workerData),
        onSuccess: () => {
            // Invalidate workers list if we had one
            queryClient.invalidateQueries({
                queryKey: WORKER_KEYS.all,
            });
        },
    });

    return {
        createWorker: createWorkerMutation.mutateAsync,
        isCreatingWorker: createWorkerMutation.isPending,
        createWorkerError: createWorkerMutation.error,
    };
};



export const useWorkers = (ngoId) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        let unsubscribe;

        if (ngoId) {
            setIsLoading(true);
            setError(null);
            try {
                unsubscribe = WorkerService.getWorkers(
                    ngoId,
                    (workers) => {
                        console.log('Workers received:', workers);
                        setData(workers);
                        setIsLoading(false);
                    },
                    (err) => {
                        console.error("Error fetching workers:", err);
                        setError(err);
                        setIsLoading(false);
                    }
                );
            } catch (err) {
                console.error("Error setting up worker listener:", err);
                setError(err);
                setIsLoading(false);
            }
        } else {
            console.log('No ngoId provided');
            setData([]);
            setIsLoading(false);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [ngoId, refreshTrigger]);

    const refetch = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return { data, isLoading, error, refetch };
};

// Hook to fetch a single worker by ID
export const useWorkerById = (workerId) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorker = async () => {
            if (workerId) {
                setIsLoading(true);
                try {
                    const worker = await WorkerService.getWorkerById(workerId);
                    setData(worker);
                    setIsLoading(false);
                } catch (err) {
                    console.error("Error fetching worker:", err);
                    setError(err);
                    setIsLoading(false);
                }
            } else {
                setData(null);
                setIsLoading(false);
            }
        };

        fetchWorker();
    }, [workerId]);

    return { data, isLoading, error };
};
