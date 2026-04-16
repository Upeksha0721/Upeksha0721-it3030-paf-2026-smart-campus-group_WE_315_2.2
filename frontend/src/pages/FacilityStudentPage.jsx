import React, { useEffect, useState } from "react";
import FacilityTable from "../components/FacilityTable";
import { getAllFacilities, searchFacilities } from "../services/facilityService";

function FacilityStudentPage() {
  const [facilities, setFacilities] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    minCapacity: "",
    location: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const data = await getAllFacilities();
      setFacilities(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load facilities");
    }
  };

  const handleSearch = async () => {
    try {
      const data = await searchFacilities(filters);
      setFacilities(data);
      setMessage("Filtered results loaded");
    } catch (error) {
      console.error(error);
      setMessage("Search failed");
    }
  };

  const handleReset = () => {
    setFilters({
      type: "",
      minCapacity: "",
      location: "",
    });
    fetchFacilities();
    setMessage("Filters cleared");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <div>
          <h2 style={styles.pageTitle}>Facilities Catalogue</h2>
          <p style={styles.pageSubtitle}>
            Browse and search available campus facilities and assets.
          </p>
        </div>

        <div style={styles.badge}>Student View</div>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Search & Filter Facilities</h3>
        </div>

        <div style={styles.filterRow}>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            style={styles.input}
          >
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Lab</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>

          <input
            type="number"
            placeholder="Minimum Capacity"
            value={filters.minCapacity}
            min="0"
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || Number(value) >= 0) {
                setFilters({ ...filters, minCapacity: value });
              }
            }}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            style={styles.input}
          />

          <button onClick={handleSearch} style={styles.searchBtn}>
            Search
          </button>

          <button onClick={handleReset} style={styles.resetBtn}>
            Reset
          </button>
        </div>
      </div>

      <div style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Available Facilities</h3>
        </div>

        <FacilityTable facilities={facilities} isAdmin={false} />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "20px",
    background: "#091A2F",
    color: "white",
    minHeight: "100%",
  },
  headerCard: {
    background: "#122A42",
    border: "1px solid #1A3A5A",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
    color: "#fff",
  },
  pageSubtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#A0B0C4",
    fontSize: "14px",
  },
  badge: {
    background: "#0F4A2A",
    color: "#4ade80",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  message: {
    background: "#1a3a5a",
    color: "#fff",
    padding: "12px 14px",
    borderRadius: "10px",
    marginBottom: "18px",
    border: "1px solid #23496f",
  },
  sectionCard: {
    background: "#122A42",
    border: "1px solid #1A3A5A",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    gap: "12px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
    color: "#fff",
    fontSize: "20px",
    fontWeight: 700,
  },
  filterRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    marginTop: "6px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #1A3A5A",
    background: "#0D2137",
    color: "#fff",
    outline: "none",
  },
  searchBtn: {
    background: "#FFC107",
    color: "#091A2F",
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  resetBtn: {
    background: "#5B6470",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default FacilityStudentPage;