import { fetchNotes } from "@/lib/api";
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import type { NotesResponse } from '@/lib/api';

export default async function NotesPage() {
  const queryClient = new QueryClient();
  
  const initialData: NotesResponse = await fetchNotes('', 1);
  
  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1],
    queryFn: () => fetchNotes('', 1),
    initialData
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialData={initialData} />
    </HydrationBoundary>
  );
}