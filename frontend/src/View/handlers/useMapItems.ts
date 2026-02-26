import { useEffect, useState } from 'react';
import type { RawItem } from '../../Domain/Types/mapTypes';


const API_URL = 'http://localhost:8000/lostAndFoundItems';

interface UseMapItemsResult {
    items: RawItem[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useMapItems(enabled: boolean): UseMapItemsResult {
    const [items,   setItems]   = useState<RawItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState<string | null>(null);
    const [tick,    setTick]    = useState(0);

    const refetch = () => setTick(t => t + 1);

    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch(API_URL)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((data: RawItem[]) => {
                if (!cancelled) setItems(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                if (!cancelled) setError(err.message ?? 'خطا در دریافت داده');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [enabled, tick]);

    return { items, loading, error, refetch };
}