import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ReportService from '../services/ReportService';

const REPORT_KEYS = {
    all: ['reports'],
    byUser: (userId) => ['reports', 'user', userId],
    byWorker: (workerId) => ['reports', 'worker', workerId],
    byNgo: (ngoId) => ['reports', 'ngo', ngoId],
    byStatus: (status) => ['reports', 'status', status],
    detail: (id) => ['reports', id],
};

export const useReport = () => {
    const queryClient = useQueryClient();

    // Mutation to create a new report
    const createReportMutation = useMutation({
        mutationFn: (reportData) => ReportService.createReport(reportData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: REPORT_KEYS.all,
            });
        },
    });

    // Mutation to update report status
    const updateReportStatusMutation = useMutation({
        mutationFn: ({ reportId, status, workerId, workerName }) => 
            ReportService.updateReportStatus(reportId, status, workerId, workerName),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: REPORT_KEYS.all,
            });
        },
    });

    // Mutation to update report
    const updateReportMutation = useMutation({
        mutationFn: ({ reportId, data }) => ReportService.updateReport(reportId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: REPORT_KEYS.all,
            });
        },
    });

    // Mutation to delete report
    const deleteReportMutation = useMutation({
        mutationFn: (reportId) => ReportService.deleteReport(reportId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: REPORT_KEYS.all,
            });
        },
    });

    return {
        createReport: createReportMutation.mutateAsync,
        isCreatingReport: createReportMutation.isPending,
        createReportError: createReportMutation.error,
        
        updateReportStatus: updateReportStatusMutation.mutateAsync,
        isUpdatingStatus: updateReportStatusMutation.isPending,
        updateStatusError: updateReportStatusMutation.error,
        
        updateReport: updateReportMutation.mutateAsync,
        isUpdatingReport: updateReportMutation.isPending,
        updateReportError: updateReportMutation.error,
        
        deleteReport: deleteReportMutation.mutateAsync,
        isDeletingReport: deleteReportMutation.isPending,
        deleteReportError: deleteReportMutation.error,
    };
};

// Hook to fetch all reports
export const useReports = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                const reports = await ReportService.getAllReports();
                setData(reports);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching reports:", err);
                setError(err);
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    return { data, isLoading, error };
};

// Hook to fetch user reports
export const useUserReports = (userId) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserReports = async () => {
            if (userId) {
                setIsLoading(true);
                try {
                    const reports = await ReportService.getUserReports(userId);
                    setData(reports);
                    setIsLoading(false);
                } catch (err) {
                    console.error("Error fetching user reports:", err);
                    setError(err);
                    setIsLoading(false);
                }
            } else {
                setData([]);
                setIsLoading(false);
            }
        };

        fetchUserReports();
    }, [userId]);

    return { data, isLoading, error };
};

// Hook to fetch worker reports
export const useWorkerReports = (workerId) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkerReports = async () => {
            if (workerId) {
                setIsLoading(true);
                try {
                    const reports = await ReportService.getWorkerReports(workerId);
                    setData(reports);
                    setIsLoading(false);
                } catch (err) {
                    console.error("Error fetching worker reports:", err);
                    setError(err);
                    setIsLoading(false);
                }
            } else {
                setData([]);
                setIsLoading(false);
            }
        };

        fetchWorkerReports();
    }, [workerId]);

    return { data, isLoading, error };
};

// Hook to fetch reports by NGO
export const useNgoReports = (ngoId) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNgoReports = async () => {
            if (ngoId) {
                setIsLoading(true);
                try {
                    const reports = await ReportService.getReportsByNgoId(ngoId);
                    setData(reports);
                    setIsLoading(false);
                } catch (err) {
                    console.error("Error fetching NGO reports:", err);
                    setError(err);
                    setIsLoading(false);
                }
            } else {
                setData([]);
                setIsLoading(false);
            }
        };

        fetchNgoReports();
    }, [ngoId]);

    return { data, isLoading, error };
};

// Hook to fetch assigned reports by NGO
export const useAssignedNgoReports = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssignedNgoReports = async () => {
            if (ngoId) {
                setIsLoading(true);
                try {
                    const reports = await ReportService.getAssignedReports();
                    setData(reports);
                    setIsLoading(false);
                } catch (err) {
                    console.error("Error fetching assigned NGO reports:", err);
                    setError(err);
                    setIsLoading(false);
                }
            } else {
                setData([]);
                setIsLoading(false);
            }
        };

        fetchAssignedNgoReports();
    }, [ngoId]);

    return { data, isLoading, error };
};

// Hook to fetch reports by status
export const useReportsByStatus = (status) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReportsByStatus = async () => {
            if (status) {
                setIsLoading(true);
                try {
                    const reports = await ReportService.getReportsByStatus(status);
                    setData(reports);
                    setIsLoading(false);
                } catch (err) {
                    console.error("Error fetching reports by status:", err);
                    setError(err);
                    setIsLoading(false);
                }
            } else {
                setData([]);
                setIsLoading(false);
            }
        };

        fetchReportsByStatus();
    }, [status]);

    return { data, isLoading, error };
};

// Hook to fetch a single report
export const useReportDetail = (reportId) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            if (reportId) {
                setIsLoading(true);
                try {
                    const report = await ReportService.getReport(reportId);
                    setData(report);
                    setIsLoading(false);
                } catch (err) {
                    console.error("Error fetching report:", err);
                    setError(err);
                    setIsLoading(false);
                }
            } else {
                setData(null);
                setIsLoading(false);
            }
        };

        fetchReport();
    }, [reportId]);

    return { data, isLoading, error };
};
