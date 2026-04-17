import React from "react";

function FacilityTable({ facilities, onEdit, onDelete, isAdmin = false }) {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Facilities Catalogue</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Capacity / Quantity</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Availability</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Description</th>
              {isAdmin && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {facilities.length > 0 ? (
              facilities.map((facility) => (
                <tr key={facility.id}>
                  <td style={styles.td}>{facility.name}</td>
                  <td style={styles.td}>{formatType(facility.type)}</td>
                  <td style={styles.td}>
                    {facility.capacity}
                    {facility.type === "EQUIPMENT" ? " unit(s)" : ""}
                  </td>
                  <td style={styles.td}>{facility.location}</td>
                  <td style={styles.td}>
                    {facility.availabilityStart} - {facility.availabilityEnd}
                  </td>
                  <td style={styles.td}>{formatStatus(facility.status)}</td>
                  <td style={styles.td}>{facility.description}</td>

                  {isAdmin && (
                    <td style={styles.td}>
                      <button
                        onClick={() => onEdit(facility)}
                        style={styles.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(facility.id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} style={styles.noData}>
                  No facilities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatType(type) {
  switch (type) {
    case "LECTURE_HALL":
      return "Lecture Hall";
    case "MEETING_ROOM":
      return "Meeting Room";
    case "EQUIPMENT":
      return "Equipment";
    case "LAB":
      return "Lab";
    default:
      return type;
  }
}

function formatStatus(status) {
  if (status === "OUT_OF_SERVICE") return "Out of Service";
  return status;
}

const styles = {
  container: {
    background: "#112b46",
    padding: "20px",
    borderRadius: "12px",
    color: 'var(--text-primary)',
  },
  heading: {
    marginBottom: "15px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#163452",
  },
  th: {
    border: "1px solid #2b4d70",
    padding: "12px",
    background: "#0d2238",
    textAlign: "left",
  },
  td: {
    border: "1px solid #2b4d70",
    padding: "12px",
    verticalAlign: "top",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
  },
  editBtn: {
    background: "#f4b400",
    color: "black",
    border: "none",
    padding: "8px 12px",
    marginRight: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#c62828",
    color: 'var(--text-primary)',
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default FacilityTable;