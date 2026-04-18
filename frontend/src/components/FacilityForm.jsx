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

function LabelWithIcon({ icon, text }) {
  return (
    <span style={styles.labelWithIcon}>
      <span style={styles.labelIcon}>{icon}</span>
      <span>{text}</span>
    </span>
  );
}

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
        selectedType === "EQUIPMENT"
          ? prev.equipmentName || "Projector"
          : "Projector",
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
    <div style={styles.pageWrapper}>
      <div style={styles.formContainer}>
        <div style={styles.headerSection}>
          <div style={styles.badge}>
            {editingFacility ? "✏️ Edit Resource" : "✨ New Resource"}
          </div>

          <h2 style={styles.heading}>
            {editingFacility ? "Update Facility" : "Add New Facility"}
          </h2>

          <p style={styles.subText}>
            Fill in the details below to {editingFacility ? "update" : "add"} a
            facility or equipment resource in a clean and organized way.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.gridRow}>
            {!isEquipment ? (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <LabelWithIcon icon="🏢" text="Facility Name" />
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter facility name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            ) : (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <LabelWithIcon icon="🖥️" text="Equipment Type" />
                </label>
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
              <label style={styles.label}>
                <LabelWithIcon icon="🧩" text="Resource Type" />
              </label>
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
              <label style={styles.label}>
                <LabelWithIcon icon="⚙️" text="Status" />
              </label>
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
              <label style={styles.label}>
                <LabelWithIcon
                  icon={isEquipment ? "📦" : "👥"}
                  text={isEquipment ? "Quantity" : "Capacity"}
                />
              </label>
              <input
                type="number"
                name="capacity"
                placeholder={isEquipment ? "Enter quantity" : "Enter capacity"}
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <LabelWithIcon icon="📍" text="Location" />
              </label>
              <input
                type="text"
                name="location"
                placeholder={
                  isEquipment
                    ? "Storage Room / Lab / Media Unit"
                    : "Enter location"
                }
                value={formData.location}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <LabelWithIcon icon="🕒" text="Availability Start" />
              </label>
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
              <label style={styles.label}>
                <LabelWithIcon icon="⏰" text="Availability End" />
              </label>
              <input
                type="time"
                name="availabilityEnd"
                value={formData.availabilityEnd}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.fullWidthField}>
            <label style={styles.label}>
              <LabelWithIcon icon="📝" text="Description" />
            </label>
            <textarea
              name="description"
              placeholder={
                isEquipment
                  ? "Add equipment details, usage notes, condition, or special instructions"
                  : "Add facility details, features, and any important notes"
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
              <button
                type="button"
                onClick={onCancel}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "10px 16px 24px 16px",
    boxSizing: "border-box",
  },

  formContainer: {
    width: "100%",
    maxWidth: "1050px",
    margin: "0 auto",
    background:
      "linear-gradient(145deg, rgba(17,43,70,0.98), rgba(13,59,102,0.98))",
    padding: "30px",
    borderRadius: "22px",
    color: "#ffffff",
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.22)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxSizing: "border-box",
  },

  headerSection: {
    marginBottom: "22px",
  },

  badge: {
    display: "inline-block",
    padding: "7px 14px",
    borderRadius: "999px",
    background: "rgba(255, 196, 0, 0.16)",
    color: "#ffd24d",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "14px",
    border: "1px solid rgba(255, 210, 77, 0.25)",
  },

  heading: {
    margin: "0 0 8px 0",
    fontSize: "38px",
    fontWeight: "800",
    lineHeight: "1.2",
    letterSpacing: "-0.5px",
  },

  subText: {
    margin: 0,
    color: "#d9e6f2",
    fontSize: "15px",
    lineHeight: "1.7",
    maxWidth: "720px",
  },

  form: {
    display: "grid",
    gap: "22px",
  },

  gridRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    alignItems: "start",
  },

  fieldGroup: {
    display: "grid",
    gap: "8px",
  },

  fullWidthField: {
    display: "grid",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#ffffff",
  },

  labelWithIcon: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },

  labelIcon: {
    fontSize: "15px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    width: "100%",
    padding: "13px 15px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.14)",
    fontSize: "14px",
    outline: "none",
    background: "#f8fbff",
    color: "#1f2937",
    boxSizing: "border-box",
    transition: "0.2s ease",
    minHeight: "50px",
  },

  textarea: {
    width: "100%",
    padding: "15px",
    borderRadius: "16px",
    minHeight: "130px",
    border: "1px solid rgba(255,255,255,0.14)",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    background: "#f8fbff",
    color: "#1f2937",
    lineHeight: "1.6",
    boxSizing: "border-box",
  },

  buttonRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "4px",
  },

  saveBtn: {
    background: "linear-gradient(135deg, #f4b400, #ffcf3e)",
    color: "#111827",
    padding: "13px 24px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "15px",
    boxShadow: "0 10px 22px rgba(244, 180, 0, 0.28)",
    transition: "0.2s ease",
  },

  cancelBtn: {
    background: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    padding: "13px 24px",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    backdropFilter: "blur(4px)",
  },
};

export default FacilityForm;