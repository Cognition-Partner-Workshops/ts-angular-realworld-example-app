interface PaginationProps {
  totalCount: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalCount, currentPage, limit, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalCount / limit);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav data-testid="pagination">
      <ul className="pagination">
        {pages.map(page => (
          <li
            key={page}
            className={`page-item${page === currentPage ? ' active' : ''}`}
          >
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
