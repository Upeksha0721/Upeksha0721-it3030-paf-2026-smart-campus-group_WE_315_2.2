import React, { useEffect, useState } from "react";

const EQUIPMENT_OPTIONS = [
  "Projector",
  "Camera",
  "Microphone",
  "Desktop PC",
  "Printer",
];

const initialForm = {
  name: "",
  equipmentName: "Projector",
  type: "LAB",
  capacity: "",
  location: "",
  availabilityStart: "",
  availabilityEnd: "",
  status: "ACTIVE",
  description: "",
};

function FacilityForm({ onSubmit, editingFacility, onCancel }) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (editingFacility) {
      const isEquipment = editingFacility.type === "EQUIPMENT";
      const matchedEquipment = EQUIPMENT_OPTIONS.includes(editingFacility.name)
        ? editingFacility.name
        : "Projector";

      setFormData({
        name: isEquipment ? "" : editingFacility.name || "",
        equipmentName: isEquipment ? matchedEquipment : "Projector",
        type: editingFacility.type || "LAB",
        capacity: editingFacility.capacity || "",
        location: editingFacility.location || "",
        availabilityStart: editingFacility.availabilityStart || "",
        availabilityEnd: editingFacility.availabilityEnd || "",
        status: editingFacility.status || "ACTIVE",
        description: editingFacility.description || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [editingFacility]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;

    setFormData((prev) => ({
      ...prev,
      type: selectedType,
      name: selectedType === "EQUIPMENT" ? "" : prev.name,
      equipmentName:
        selectedType === "EQUIPMENT" ? prev.equipmentName || "Projector" : "Projector",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalName =
      formData.type === "EQUIPMENT" ? formData.equipmentName : formData.name;

    const payload = {
      name: finalName,
      type: formData.type,
      capacity: Number(formData.capacity),
      location: formData.location,
      availabilityStart: formData.availabilityStart,
      availabilityEnd: formData.availabilityEnd,
      status: formData.status,
      description: formData.description,
    };

    onSubmit(payload);
  };

  const isEquipment = formData.type === "EQUIPMENT";

  return (
    <div style={styles.formContainer}>
      <h2>{editingFacility ? "Update Facility" : "Add New Facility"}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {!isEquipment ? (
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Facility Name</label>
            <input
              type="text"
              name="name"
              placeholder="Facility Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        ) : (
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Equipment Type</label>
            <select
              name="equipmentName"
              value={formData.equipmentName}
              onChange={handleChange}
              required
              style={styles.input}
            >
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Resource Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleTypeChange}
            style={styles.input}
          >
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Lab</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>{isEquipment ? "Quantity" : "Capacity"}</label>
          <input
            type="number"
            name="capacity"
            placeholder={isEquipment ? "Quantity" : "Capacity"}
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Location</label>
          <input
            type="text"
            name="location"
            placeholder={isEquipment ? "Storage Room / Lab / Media Unit" : "Location"}
            value={formData.location}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Availability Start</label>
          <input
            type="time"
            name="availabilityStart"
            value={formData.availabilityStart}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Availability End</label>
          <input
            type="time"
            name="availabilityEnd"
            value={formData.availabilityEnd}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
          </select>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            placeholder={
              isEquipment
                ? "Add equipment details, usage notes, or condition"
                : "Add facility details"
            }
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        <div style={styles.buttonRow}>
          <button type="submit" style={styles.saveBtn}>
            {editingFacility ? "Update Facility" : "Add Facility"}
          </button>

          {editingFacility && (
            <button type="button" onClick={onCancel} style={styles.cancelBtn}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const styles = {
  formContainer: {
    background: "#112b46",
    padding: "20px",
    borderRadius: "12px",
    color: "white",
    marginBottom: "20px",
  },
  form: {
    display: "grid",
    gap: "14px",
  },
  fieldGroup: {
    display: "grid",
    gap: "6px",
  },
  label: {
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 600,
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    minHeight: "90px",
    border: "1px solid #ccc",
    fontSize: "14px",
    resize: "vertical",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "6px",
  },
  saveBtn: {
    background: "#f4b400",
    color: "#000",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cancelBtn: {
    background: "#888",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default FacilityForm;