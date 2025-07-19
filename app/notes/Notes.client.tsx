'use client'

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteModal from '@/components/NoteModal/NoteModal';
import { fetchNotes, NotesResponse } from '@/lib/api';
import css from './NotesPage.module.css';

type NotesClientProps = {
  initialData: NotesResponse;
}

const NotesClient = ({ initialData }: NotesClientProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const { data } = useQuery({
    queryKey: ['notes', debouncedSearchQuery, currentPage],
    queryFn: () => fetchNotes(debouncedSearchQuery, currentPage),
    placeholderData: keepPreviousData,
    initialData: currentPage === 1 && !debouncedSearchQuery ? initialData : undefined
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox searchQuery={searchQuery} onChange={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={data.totalPages}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {data?.notes && <NoteList notes={data.notes} />}
      {isModalOpen && <NoteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default NotesClient;