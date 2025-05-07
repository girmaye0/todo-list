import React, { useRef, useEffect } from "react";

function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [queryString]);

  const handleSearchInputChange = (event) => {
    setQueryString(event.target.value);
  };

  const clearSearch = () => {
    setQueryString("");
    searchInputRef.current.focus();
  };

  const preventRefresh = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label htmlFor="search">Search todos:</label>
        <input
          type="text"
          id="search"
          value={queryString}
          onChange={handleSearchInputChange}
          ref={searchInputRef}
        />
        <button type="button" onClick={clearSearch}>
          Clear
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
        <div style={{ marginRight: "20px" }}>
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortDirection">Direction:</label>
          <select
            id="sortDirection"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </form>
  );
}

export default TodosViewForm;
