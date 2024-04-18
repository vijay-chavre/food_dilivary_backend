interface PaginationResult<T> {
  currentPage: number;
  nextPage: number | null;
  totalPages: number;
  data: T[];
}

export function attachPagination<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginationResult<T> {
  const nextPage = page * limit >= total ? null : page + 1;
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    nextPage,
    totalPages,
    data,
  };
}
