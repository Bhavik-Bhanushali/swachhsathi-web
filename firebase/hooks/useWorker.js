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

    useEffect(() => {
        let unsubscribe;

        if (ngoId) {
            setIsLoading(true);
            try {
                unsubscribe = WorkerService.getWorkers(
                    ngoId,
                    (workers) => {
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
            setData([]);
            setIsLoading(false);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [ngoId]);

    return { data, isLoading, error };
};
