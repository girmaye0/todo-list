import React, { forwardRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 50%;
`;

const StyledLabel = styled.label`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0;
  margin-right: 8px;
  width: auto;
`;

const StyledInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  flex: 1;
  width: 0;
  min-width: 0;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const TextInputWithLabel = forwardRef(
  ({ elementId, label, value, onChange }, ref) => {
    return (
      <Container>
        <StyledLabel htmlFor={elementId}>{label}</StyledLabel>
        <StyledInput
          type="text"
          id={elementId}
          value={value}
          onChange={onChange}
          ref={ref}
        />
      </Container>
    );
  }
);

TextInputWithLabel.displayName = "TextInputWithLabel";

export default TextInputWithLabel;
