import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../api/analytics';

export function useAnalyticsSummary(params?: any) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const result = await analyticsAPI.getSummary(params);
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [params?.dateRange, params?.caseType, params?.riskLevel, params?.assignedTo, params?.status]);

  return { data, isLoading };
}

export function useCasesOverTime(params?: any) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const result = await analyticsAPI.getCasesOverTime(params);
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [params?.dateRange, params?.caseType, params?.riskLevel, params?.assignedTo, params?.status]);

  return { data, isLoading };
}

export function useCasesByStatus(params?: any) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const result = await analyticsAPI.getCasesByStatus(params);
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [params?.dateRange, params?.caseType, params?.riskLevel, params?.assignedTo, params?.status]);

  return { data, isLoading };
}

export function useCasesByRiskLevel(params?: any) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const result = await analyticsAPI.getCasesByRiskLevel(params);
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [params?.dateRange, params?.caseType, params?.riskLevel, params?.assignedTo, params?.status]);

  return { data, isLoading };
}

export function useCasesByType(params?: any) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const result = await analyticsAPI.getCasesByType(params);
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [params?.dateRange, params?.caseType, params?.riskLevel, params?.assignedTo, params?.status]);

  return { data, isLoading };
}

export function useTopInvestigators(params?: any) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const result = await analyticsAPI.getTopInvestigators(params);
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [params?.dateRange, params?.caseType, params?.riskLevel, params?.assignedTo, params?.status]);

  return { data, isLoading };
}

export function useAmountAtRiskOverTime(params?: any) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const result = await analyticsAPI.getAmountAtRiskOverTime(params);
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [params?.dateRange, params?.caseType, params?.riskLevel, params?.assignedTo, params?.status]);

  return { data, isLoading };
}
