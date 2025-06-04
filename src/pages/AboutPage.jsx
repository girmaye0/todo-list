import React from "react";
import styles from "../App.module.css"; // Import styles from App.module.css

function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <h2>About This Todo App</h2>
      <p>
        This is a simple Todo List application built with React, demonstrating
        fundamental web development concepts with the help of CTD. It interacts
        with Airtable as a backend for data persistence.
      </p>

      <h3>React Basics Explored:</h3>
      <h4>1. Project Setup and Dependencies:</h4>
      <p>
        A React project typically starts with a build tool like Vite (as used
        here) or Create React App. Dependencies are managed via `package.json`
        and installed using `npm install` (or `yarn install`). Key dependencies
        include `react` (the core library), `react-dom` (for web rendering), and
        `react-router-dom` (for routing).
      </p>
      <p>
        Repositories like GitHub are used for version control and collaboration.
      </p>

      <h4>2. Project Structure and Components:</h4>
      <p>
        React applications are organized into a component-based architecture.
        Common directories include: `src/` (all source code), `src/components/`
        (reusable UI elements), `src/features/` (components related to specific
        application features), `src/pages/` (top-level components representing
        different views/pages), `src/shared/` (utility components or styles
        shared across the application), `src/assets/` (static assets like
        images), and `src/reducers/` (logic for managing complex state, often
        used with `useReducer`). Components are JavaScript functions that return
        React elements, describing what should appear on the screen.
      </p>

      <h4>3. State Management:</h4>
      <p>
        React uses state to manage data that changes over time and affects
        component rendering. `useState` is a React Hook that lets you add React
        state to function components, used for managing local component-specific
        state. `useReducer` is a React Hook for more complex state logic,
        especially when state transitions depend on the previous state or
        involve multiple sub-values. It's often preferred for global or
        feature-specific state management, as seen with the `todos.reducer.js`
        in this app.
      </p>

      <h4>4. Props:</h4>
      <p>
        Props (short for "properties") are arguments passed into React
        components. They allow components to receive data from their parents,
        enabling reusability and data flow from parent to child components.
      </p>

      <h4>5. Styling:</h4>
      <p>
        This application uses a combination of CSS for global styles (`App.css`)
        and CSS Modules (`*.module.css`) for component-specific styling. CSS
        Modules help prevent style conflicts by localizing class names.
      </p>

      <h4>6. Routing:</h4>
      <p>
        Navigation between different parts of the application is handled by
        `react-router-dom`. `BrowserRouter` wraps the entire application to
        enable client-side routing. `Routes` is a container for `Route`
        components, rendering the first `Route` that matches the current URL.
        `Route` defines a path and the component to render when that path
        matches the URL. `Link` and `NavLink` are components used for
        navigation; `NavLink` provides additional functionality to style active
        links. `useLocation` is a Hook to access the current URL location
        object. `useNavigate` is a Hook to programmatically navigate to
        different routes. `useSearchParams` is a Hook to read and modify the
        URL's query string parameters, as used for pagination in this app.
      </p>

      <h4>7. Pagination:</h4>
      <p>
        The todo list implements client-side pagination, displaying a limited
        number of items per page. This is achieved by calculating the subset of
        todos to display based on the current page and items per page. It uses
        `useSearchParams` to store the current page number in the URL's query
        parameters, allowing direct navigation to specific pages and maintaining
        state on refresh. It provides "Previous" and "Next" buttons to update
        the `page` parameter in the URL. It also implements logic to handle
        invalid page numbers in the URL, redirecting to the first page if
        necessary.
      </p>

      <p>
        This application serves as a practical example of building a single-page
        application (SPA) with React's core features and popular libraries.
      </p>
    </div>
  );
}

export default AboutPage;
