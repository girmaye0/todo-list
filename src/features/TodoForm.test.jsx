import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList";
import TodoListItem from "./TodoList/TodoListItem";
import { describe, it, expect } from "vitest"; // For Vitest
import { waitFor } from "@testing-library/react";

describe("Add Todo button is enabled when the input field has a value", async () => {
  render(<TodoForm onAddTodo={() => {}} />);

  const inputField = screen.getByLabelText(/todo/i);
  const addButton = screen.getByRole("button", { name: /add todo/i });

  await userEvent.type(inputField, "New Todo Item");

  await waitFor(() => expect(addButton).not.toBeDisabled());
});
