'use client';
import { useState, useEffect, useCallback } from 'react';

const KEY = 'portfolio_overrides';

// ── Notes store ───────────────────────────────────────────────────────────
const NOTES_KEY = 'portfolio_notes';

export interface NoteItem {
  id: string;
  title: string;
  tag: string;
  href: string;
}

export function useNotesStore(defaults: NoteItem[]) {
  const [notes, setNotes] = useState<NoteItem[]>(defaults);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTES_KEY);
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  const persist = (next: NoteItem[]) => {
    setNotes(next);
    if (typeof window !== 'undefined') localStorage.setItem(NOTES_KEY, JSON.stringify(next));
  };

  const addNote    = (n: Omit<NoteItem, 'id'>) => persist([...notes, { ...n, id: Date.now().toString() }]);
  const removeNote = (id: string)               => persist(notes.filter(n => n.id !== id));
  const updateNote = (id: string, n: Omit<NoteItem, 'id'>) =>
    persist(notes.map(x => x.id === id ? { ...n, id } : x));

  return { notes, addNote, removeNote, updateNote };
}

// ── "Now" store ───────────────────────────────────────────────────────────
const NOW_KEY = 'portfolio_now';

export interface NowItem { emoji: string; category: string; categoryEn: string; content: string; }

export function useNowStore(defaults: NowItem[]) {
  const [items, setItems] = useState<NowItem[]>(defaults);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOW_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  const updateItem = (i: number, content: string) => {
    const next = items.map((it, idx) => idx === i ? { ...it, content } : it);
    setItems(next);
    if (typeof window !== 'undefined') localStorage.setItem(NOW_KEY, JSON.stringify(next));
  };

  return { items, updateItem };
}

// ── Hidden sections store ─────────────────────────────────────────────────
const HIDDEN_KEY = 'portfolio_hidden_sections';

export function useHiddenSections() {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HIDDEN_KEY);
      if (saved) setHidden(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const toggle = (id: string) => {
    const next = new Set(hidden);
    next.has(id) ? next.delete(id) : next.add(id);
    setHidden(next);
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(Array.from(next)));
  };

  const isHidden = (id: string) => hidden.has(id);
  return { isHidden, toggle };
}

export function useAdminContent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setOverrides(JSON.parse(saved));
    } catch {}
  }, []);

  const get = useCallback((id: string, def: string): string =>
    overrides[id] ?? def, [overrides]);

  const save = useCallback((id: string, value: string) => {
    setOverrides(prev => {
      const next = { ...prev, [id]: value };
      if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setOverrides({});
    if (typeof window !== 'undefined') localStorage.removeItem(KEY);
  }, []);

  const login = (pw: string) => { if (pw === 'your_password') { setIsAdmin(true); return true; } return false; };
  const logout = () => setIsAdmin(false);

  return { isAdmin, get, save, reset, login, logout };
}
