import React, { useState, useEffect } from "react";
import styled from "styled-components";

const StyledFormView = styled.form`
  padding-bottom: 10px;
  margin-bottom: 20px;
  width: 100%;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  color: #555;
  margin-right: 8px;
`;

const StyledInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  flex: 1;
  min-width: 0;
  margin-right: 8px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const StyledButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  background-color: #f44336;
  color: white;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d32f2f;
  }
`;

const StyledSelect = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  width: auto;
  margin-left: 8px;
  margin-right: 10px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const StyledSearchRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
`;

const StyledSortControlsRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  width: 100%;
  justify-content: space-between;
`;

const StyledSortGroup = styled.div`
  display: flex;
  align-items: center;
`;

function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryStringSetter,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    setLocalQueryString(queryString);
  }, [queryString]);

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
    setQueryStringSetter("");
  };

  const preventRefresh = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryStringSetter(localQueryString);
    }, 500);

    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryStringSetter]);

  return (
    <StyledFormView onSubmit={preventRefresh}>
      <StyledSearchRow>
        <StyledLabel htmlFor="search">Search todos:</StyledLabel>
        <StyledInput
          type="text"
          id="search"
          value={localQueryString}
          onChange={handleLocalSearchInputChange}
        />
        <StyledButton type="button" onClick={clearSearch}>
          Clear
        </StyledButton>
      </StyledSearchRow>
      <StyledSortControlsRow>
        <StyledSortGroup>
          <StyledLabel htmlFor="sortBy">Sort by:</StyledLabel>
          <StyledSelect
            id="sortBy"
            value={sortField}
            onChange={handleSortFieldChange}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </StyledSelect>
        </StyledSortGroup>
        <StyledSortGroup>
          <StyledLabel htmlFor="sortDirection">Direction:</StyledLabel>
          <StyledSelect
            id="sortDirection"
            value={sortDirection}
            onChange={handleSortDirectionChange}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </StyledSelect>
        </StyledSortGroup>
      </StyledSortControlsRow>
    </StyledFormView>
  );
}

export default TodosViewForm;
