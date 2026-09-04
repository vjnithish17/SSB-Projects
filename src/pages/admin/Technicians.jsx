import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  Search,
  MapPin,
  Wrench,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "./css/adminTechnicians.css";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  specialization: "",
  experience: "",
  location: "",
};

const Technicians = () => {
  const { showToast } = useToast();

  const [technicians, setTechnicians] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [search, setSearch] = useState("");

  // ==========================================
  // FETCH TECHNICIANS
  // ==========================================

  const fetchTechnicians = async () => {
    try {
      setLoading(true);

      const res = await api.get("/technicians");

      setTechnicians(res.data.technicians || []);
    } catch (err) {
      console.error(
        "FETCH TECHNICIANS ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to fetch technicians",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setFormData(emptyForm);
    setEditId(null);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (technician) => {
    setFormData({
      name: technician.name || "",
      email: technician.email || "",
      password: "",
      phone: technician.phone || "",
      specialization:
        technician.specialization || "",
      experience:
        technician.experience ?? "",
      location: technician.location || "",
    });

    setEditId(technician._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast(
        "Technician name is required",
        "warning"
      );
      return;
    }

    if (!formData.email.trim()) {
      showToast(
        "Email is required",
        "warning"
      );
      return;
    }

    if (!formData.phone.trim()) {
      showToast(
        "Phone number is required",
        "warning"
      );
      return;
    }

    if (!formData.specialization.trim()) {
      showToast(
        "Specialization is required",
        "warning"
      );
      return;
    }

    if (
      formData.experience === "" ||
      Number(formData.experience) < 0
    ) {
      showToast(
        "Enter valid experience",
        "warning"
      );
      return;
    }

    if (!formData.location.trim()) {
      showToast(
        "Location is required",
        "warning"
      );
      return;
    }

    if (
      !editId &&
      !formData.password.trim()
    ) {
      showToast(
        "Password is required",
        "warning"
      );
      return;
    }

    if (
      !editId &&
      formData.password.length < 6
    ) {
      showToast(
        "Password must be at least 6 characters",
        "warning"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email
          .trim()
          .toLowerCase(),
        phone: formData.phone.trim(),
        specialization:
          formData.specialization.trim(),
        experience: Number(
          formData.experience
        ),
        location:
          formData.location.trim(),
      };

      // Password only when creating
      // or when admin enters a new password.
      if (formData.password.trim()) {
        payload.password =
          formData.password;
      }

      if (editId) {
        await api.put(
          `/technicians/${editId}`,
          payload
        );

        showToast(
          "Technician updated successfully",
          "success"
        );
      } else {
        await api.post(
          "/technicians",
          payload
        );

        showToast(
          "Technician added successfully",
          "success"
        );
      }

      resetForm();

      await fetchTechnicians();
    } catch (err) {
      console.error(
        "SAVE TECHNICIAN ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to save technician",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const deleteTechnician = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this technician?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(id);

      await api.delete(
        `/technicians/${id}`
      );

      showToast(
        "Technician deleted successfully",
        "success"
      );

      await fetchTechnicians();
    } catch (err) {
      console.error(
        "DELETE TECHNICIAN ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to delete technician",
        "error"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // TOGGLE AVAILABILITY
  // ==========================================

  const toggleAvailability = async (
    id
  ) => {
    try {
      setActionLoading(id);

      await api.put(
        `/technicians/${id}/availability`
      );

      showToast(
        "Technician availability updated",
        "success"
      );

      await fetchTechnicians();
    } catch (err) {
      console.error(
        "AVAILABILITY ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to update availability",
        "error"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredTechnicians =
    technicians.filter((technician) => {
      const value =
        search.toLowerCase().trim();

      if (!value) return true;

      return (
        technician.name
          ?.toLowerCase()
          .includes(value) ||
        technician.email
          ?.toLowerCase()
          .includes(value) ||
        technician.specialization
          ?.toLowerCase()
          .includes(value) ||
        technician.location
          ?.toLowerCase()
          .includes(value)
      );
    });

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="admin-technicians-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="technicians-header">

        <div>
          <span>ADMIN PANEL</span>

          <h1>
            Technician Management
          </h1>

          <p>
            Manage technician profiles, status
            and availability.
          </p>
        </div>

        <button
          className="add-technician-btn"
          onClick={openAddForm}
        >
          <UserPlus size={16} />
          Add Technician
        </button>

      </div>

      {/* ======================================
          FORM
      ====================================== */}

      {showForm && (
        <div className="technician-form-card">

          <div className="form-title">

            <div>
              <span>
                {editId
                  ? "EDIT TECHNICIAN"
                  : "NEW TECHNICIAN"}
              </span>

              <h2>
                {editId
                  ? "Update Technician"
                  : "Add Technician"}
              </h2>
            </div>

            <button
              type="button"
              className="close-form-btn"
              onClick={resetForm}
              disabled={saving}
              title="Close"
            >
              <X size={17} />
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* NAME */}

              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Technician name"
                  maxLength={100}
                  required
                />
              </div>

              {/* EMAIL */}

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="technician@email.com"
                  disabled={!!editId}
                  required
                />
              </div>

              {/* PASSWORD */}

              <div className="form-group">
                <label>
                  Password
                  {editId && (
                    <small>
                      {" "}
                      (optional)
                    </small>
                  )}
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    editId
                      ? "Leave blank to keep current password"
                      : "Login password"
                  }
                  minLength={6}
                  required={!editId}
                />
              </div>

              {/* PHONE */}

              <div className="form-group">
                <label>Phone</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  maxLength={15}
                  required
                />
              </div>

              {/* SPECIALIZATION */}

              <div className="form-group">
                <label>
                  Specialization
                </label>

                <input
                  type="text"
                  name="specialization"
                  value={
                    formData.specialization
                  }
                  onChange={handleChange}
                  placeholder="e.g. Electrician"
                  maxLength={100}
                  required
                />
              </div>

              {/* EXPERIENCE */}

              <div className="form-group">
                <label>
                  Experience
                </label>

                <input
                  type="number"
                  min="0"
                  name="experience"
                  value={
                    formData.experience
                  }
                  onChange={handleChange}
                  placeholder="Years"
                  required
                />
              </div>

              {/* LOCATION */}

              <div className="form-group">
                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City / Area"
                  maxLength={100}
                  required
                />
              </div>

            </div>

            {/* FORM ACTIONS */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-form-btn"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-technician-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2
                      size={15}
                      className="spin-icon"
                    />

                    Saving...
                  </>
                ) : editId ? (
                  <>
                    <Pencil size={14} />
                    Update Technician
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    Add Technician
                  </>
                )}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ======================================
          TECHNICIANS CARD
      ====================================== */}

      <div className="technicians-card">

        {/* CARD HEADER */}

        <div className="card-heading">

          <div>
            <h2>
              All Technicians
            </h2>

            <p>
              {technicians.length}{" "}
              {technicians.length === 1
                ? "technician"
                : "technicians"}
            </p>
          </div>

          <button
            className="technician-refresh-btn"
            onClick={fetchTechnicians}
            disabled={loading}
          >
            <RefreshCw
              size={14}
              className={
                loading
                  ? "refresh-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

        {/* ==================================
            SEARCH
        ================================== */}

        {!loading &&
          technicians.length > 0 && (
            <div className="technician-search-box">

              <Search
                size={16}
                className="search-icon"
              />

              <input
                type="text"
                placeholder="Search by name, email, specialization or location..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="clear-search-btn"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}

            </div>
          )}

        {/* ==================================
            LOADING
        ================================== */}

        {loading ? (

          <div className="technician-loading">

            <div className="technician-spinner"></div>

            <p>
              Loading technicians...
            </p>

          </div>

        ) : filteredTechnicians.length === 0 ? (

          /* =================================
             EMPTY
          ================================= */

          <div className="technician-empty">

            <div className="technician-empty-icon">
              <Users size={27} />
            </div>

            <h3>
              {technicians.length === 0
                ? "No Technicians Found"
                : "No Matching Technicians"}
            </h3>

            <p>
              {technicians.length === 0
                ? "Add your first technician to get started."
                : "Try a different search term."}
            </p>

            {technicians.length === 0 && (
              <button
                onClick={openAddForm}
                className="empty-add-technician-btn"
              >
                <UserPlus size={15} />
                Add Technician
              </button>
            )}

          </div>

        ) : (

          /* =================================
             TABLE
          ================================= */

          <div className="technician-table-wrapper">

            <table className="technician-table">

              <thead>
                <tr>
                  <th>Technician</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredTechnicians.map(
                  (technician) => (
                    <tr
                      key={technician._id}
                    >

                      {/* TECHNICIAN */}

                      <td>
                        <div className="technician-info">

                          <div className="technician-avatar">
                            {technician.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "T"}
                          </div>

                          <div>
                            <strong>
                              {technician.name}
                            </strong>

                            <small>
                              {technician.email}
                            </small>

                            <small>
                              {technician.phone}
                            </small>
                          </div>

                        </div>
                      </td>

                      {/* SPECIALIZATION */}

                      <td>
                        <span className="specialization">
                          <Wrench size={12} />

                          {
                            technician.specialization
                          }
                        </span>
                      </td>

                      {/* EXPERIENCE */}

                      <td>
                        <strong>
                          {technician.experience ||
                            0}
                        </strong>{" "}
                        years
                      </td>

                      {/* LOCATION */}

                      <td>
                        <span className="location-text">

                          <MapPin size={13} />

                          {technician.location ||
                            "-"}

                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={
                            technician.status ===
                            "Active"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {technician.status ||
                            "Inactive"}
                        </span>
                      </td>

                      {/* AVAILABILITY */}

                      <td>
                        <button
                          type="button"
                          className={
                            technician.availability
                              ? "availability available"
                              : "availability unavailable"
                          }
                          onClick={() =>
                            toggleAvailability(
                              technician._id
                            )
                          }
                          disabled={
                            actionLoading ===
                            technician._id
                          }
                        >
                          {actionLoading ===
                          technician._id
                            ? "Updating..."
                            : technician.availability
                            ? "Available"
                            : "Unavailable"}
                        </button>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="action-buttons">

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() =>
                              openEditForm(
                                technician
                              )
                            }
                          >
                            <Pencil size={13} />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              deleteTechnician(
                                technician._id
                              )
                            }
                            disabled={
                              actionLoading ===
                              technician._id
                            }
                          >
                            {actionLoading ===
                            technician._id ? (
                              <>
                                <Loader2
                                  size={13}
                                  className="spin-icon"
                                />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 size={13} />
                                Delete
                              </>
                            )}
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default Technicians;
