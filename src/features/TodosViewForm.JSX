import React, { useState, useEffect } from "react";

function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
  };

  const handleSortDirectionChange = (event) => {
    setSortDirection(event.target.value);
  };

  const handleLocalSearchInputChange = (event) => {
    setLocalQueryString(event.target.value);
  };

  const clearSearch = () => {
    setLocalQueryString("");
    setQueryString("");
  };

  const preventRefresh = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label htmlFor="search">Search todos:</label>
        <input
          type="text"
          id="search"
          value={localQueryString}
          onChange={handleLocalSearchInputChange}
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
            onChange={handleSortFieldChange}
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
            onChange={handleSortDirectionChange}
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
