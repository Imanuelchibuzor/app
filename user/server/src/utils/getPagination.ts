function getPagination(page?: string, limit?: string) {
  const currentPage = Math.max(parseInt(String(page ?? "1")), 1);
  const pageSize = Math.max(parseInt(String(limit ?? "20")), 1);
  const skip = (currentPage - 1) * pageSize;
  return { pageSize, skip };
}

export default getPagination;