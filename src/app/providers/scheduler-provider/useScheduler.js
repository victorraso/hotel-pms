import { useContext } from 'react';
import { SchedulerContext } from './SchedulerContext';

export function useScheduler() {
  const ctx = useContext(SchedulerContext);
  if (!ctx)
    throw new Error('useScheduler must be used within SchedulerProvider');
  return ctx;
}
