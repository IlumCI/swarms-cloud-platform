'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const navBtn =
    'inline-flex items-center justify-center h-8 w-8 rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card flex-shrink-0';

  const pageBtn = (active: boolean) =>
    `inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-md text-xs font-medium transition-colors flex-shrink-0 tabular-nums ${
      active
        ? 'bg-foreground text-background'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
    }`;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('…');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('…');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('…');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('…');
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1 && !onItemsPerPageChange) return null;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mt-6 w-full min-w-0">
      {onItemsPerPageChange && (
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Rows per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="h-8 px-2 rounded-md border border-border bg-input text-foreground text-xs tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-w-[68px]"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      )}

      <div className="text-xs text-muted-foreground tabular-nums self-start lg:self-auto">
        {startItem}–{endItem} of {totalItems}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1 w-full lg:w-auto overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={navBtn}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 min-w-0">
            {getPageNumbers().map((page, index) => {
              if (page === '…') {
                return (
                  <span key={`ellipsis-${index}`} className="px-1.5 text-muted-foreground">…</span>
                );
              }
              const pageNum = page as number;
              return (
                <button
                  type="button"
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={pageBtn(pageNum === currentPage)}
                  aria-current={pageNum === currentPage ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={navBtn}
            aria-label="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
