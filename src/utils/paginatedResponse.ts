interface PaginationResult<T> {
  currentPage: number;
  nextPage: number | null;
  totalPages: number;
  totalCount: number;
  pageSize: number;
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
    totalCount: total,
    pageSize: limit,
    data,
  };
}

interface QueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  searchColumns?: string[];
}

export function buildQuery(options: QueryOptions) {
  const { page = 1, limit = 10, search = '', startDate, endDate } = options;

  const startIndex = (page - 1) * limit;
  const searchFilters = [];
  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    const searchColumns = options.searchColumns || ['name'];
    const searchConditions = searchColumns.map((column) => ({
      [column]: searchRegex,
    }));
    if (!searchColumns.includes('name')) {
      searchConditions.push({ name: searchRegex });
    }
    searchFilters.push({ $or: searchConditions });
  }
  if (startDate && endDate) {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    searchFilters.push({
      createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
    });
  }

  return {
    filters: searchFilters,
    startIndex,
    limit: typeof limit === 'string' ? parseInt(limit, 10) : limit,
    page,
  };
}
