import React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true
}) => {
  if (totalPages <= 1) return null

  const generatePageNumbers = () => {
    const pages = []
    const delta = 2 

    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > delta + 2) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - delta)
      const end = Math.min(totalPages - 1, currentPage + delta)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - delta - 1) {
        pages.push('...')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pages = generatePageNumbers()

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* First page (if not showing first/last) */}
        {!showFirstLast && currentPage > 3 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="h-8 w-8 p-0"
            >
              1
            </Button>
            {currentPage > 4 && (
              <div className="flex items-center justify-center h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            )}
          </>
        )}

        {/* Page numbers */}
        {pages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <div className="flex items-center justify-center h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={cn(
                  "h-8 w-8 p-0",
                  currentPage === page && "pointer-events-none"
                )}
              >
                {page}
              </Button>
            )}
          </div>
        ))}

        {/* Last page (if not showing first/last) */}
        {!showFirstLast && currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <div className="flex items-center justify-center h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="h-8 w-8 p-0"
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
