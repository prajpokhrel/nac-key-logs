import React, { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import "./styles.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // sample data (10 items)
  const data = useMemo(
    () => [
      { peg: "PEG-001", name: "Main Entrance - Contractor A", total: 4, keys: 3, spare: 1 },
      { peg: "PEG-002", name: "Server Room - IT Team", total: 6, keys: 5, spare: 1 },
      { peg: "PEG-003", name: "Storage Room - Supplies", total: 3, keys: 2, spare: 1 },
      { peg: "PEG-004", name: "Office - Manager", total: 5, keys: 4, spare: 1 },
      { peg: "PEG-005", name: "Reception - Front Desk", total: 2, keys: 2, spare: 0 },
      { peg: "PEG-006", name: "Roof Access - Maintenance", total: 4, keys: 2, spare: 2 },
      { peg: "PEG-007", name: "Lab - Research", total: 8, keys: 6, spare: 2 },
      { peg: "PEG-008", name: "Parking Gate - Security", total: 3, keys: 2, spare: 1 },
      { peg: "PEG-009", name: "Workshop - Tools", total: 6, keys: 4, spare: 2 },
      { peg: "PEG-010", name: "Conference Room - A/V", total: 2, keys: 1, spare: 1 },
    ],
    []
  );

  // filter logic: search in peg, name, and stringified numbers
  const filtered = useMemo(() => {
    if (!query) return [];
    const q = query.trim().toLowerCase();
    return data.filter((d) => {
      return (
        d.peg.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        String(d.total).includes(q) ||
        String(d.keys).includes(q) ||
        String(d.spare).includes(q)
      );
    });
  }, [query, data]);

  const handleSubmit = useCallback(
    (e) => {
      if (e && e.preventDefault) e.preventDefault();
      setSubmitted(true);
      if (!query.trim()) {
        setError("Please enter any characters to search.");
        return;
      }
      setError("");
    },
    [query]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setError("");
    setSubmitted(false);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      // Enter triggers submit (when not using form submit)
      if (e.key === "Enter") {
        // allow form to handle it normally, but prevent double behavior
        handleSubmit(e);
      }
      // Escape clears input
      if (e.key === "Escape") {
        handleClear();
      }
    },
    [handleSubmit, handleClear]
  );

  return (
    <div className="app-root">
      <header className="top-title">North American Center - Key Logs</header>

      <main className="center-area">
        <div className={`search-wrap ${query.trim() ? "lift" : ""}`}>
          <h2 className="help-title">Search for Contractors & Keys</h2>

          <form className="search-form" onSubmit={handleSubmit} noValidate>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                aria-label="search"
                className="search-input"
                placeholder="Search for contractors, keys..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError("");
                  setSubmitted(false);
                }}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
              />

              {/* Clear button - visible only when query has value */}
              {query && (
                <button
                  type="button"
                  aria-label="clear"
                  className="clear-btn"
                  onClick={handleClear}
                >
                  Clear
                </button>
              )}
            </div>
            <button type="submit" className="invisible-submit">Search</button>
          </form>

          {error && <div className="error-msg">{error}</div>}
        </div>

        {/* results area: shows only when user typed something */}
        <section className="results-area">
          {query.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="results-card">
                <div className="results-count">
                  Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </div>

                <table className="results-table" role="table">
                  <thead>
                    <tr>
                      <th>S.N.</th>
                      <th>PEG#</th>
                      <th>Name / Description</th>
                      <th>Total</th>
                      <th>Keys</th>
                      <th>Spare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, idx) => (
                      <tr key={row.peg}>
                        <td>{idx + 1}</td>
                        <td>{row.peg}</td>
                        <td>{row.name}</td>
                        <td>{row.total}</td>
                        <td>{row.keys}</td>
                        <td>{row.spare}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtered.length === 0 && <div className="no-results">No matches found.</div>}
              </div>
            </motion.div>
          )}
        </section>
      </main>

      <footer className="page-footer">Designed &amp; Built with  <span className="heart">&#9829;</span> by Prajwal Pokhrel</footer>
    </div>
  );
}