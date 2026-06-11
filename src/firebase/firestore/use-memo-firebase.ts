
'use client';

import { useMemo, useRef } from 'react';

/**
 * Firestore referanslarını (query, doc, collection) stabilize etmek için kullanılır.
 * Bağımlılıklar değişmediği sürece aynı referansı döndürür, böylece sonsuz render döngülerini önler.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<T>(null as any);
  const depsRef = useRef<any[]>([]);

  const isDepsEqual = 
    depsRef.current.length === deps.length && 
    deps.every((dep, i) => dep === depsRef.current[i]);

  if (!isDepsEqual) {
    ref.current = factory();
    depsRef.current = deps;
  }

  return ref.current;
}
