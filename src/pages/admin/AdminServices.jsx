import { useEffect, useState } from "react";
import {
  Wrench,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Clock3,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "./css/adminServices.css";

const Services = () => {
  const { showToast } = useToast();

  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    durationHours: "",
    durationMinutes: "",
  });

  /* =========================================================
     FORMAT DURATION
  ========================================================= */

  const formatDuration = (minutes) => {
    const totalMinutes = Number(minutes);

    if (
      !Number.isFinite(totalMinutes) ||
      totalMinutes <= 0
    ) {
      return "-";
    }

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours} hr ${mins} min`;
    }

    if (hours > 0) {
      return `${hours} hr`;
    }

    return `${mins} min`;
  };

  /* =========================================================
     CONVERT MINUTES TO FORM VALUES
  ========================================================= */

  const getDurationParts = (totalMinutes) => {
    const minutes = Number(totalMinutes) || 0;

    return {
      hours: Math.floor(minutes / 60),
      minutes: minutes % 60,
    };
  };

  /* =========================================================
     FETCH SERVICES
  ========================================================= */

  const fetchServices = async () => {
    try {
      setLoading(true);

      const res = await api.get("/services");

      setServices(res.data.services || []);
    } catch (err) {
      console.error(
        "FETCH SERVICES ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to fetch services",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      durationHours: "",
      durationMinutes: "",
    });

    setEditId(null);
    setShowForm(false);
  };

  /* =========================================================
     OPEN ADD FORM
  ========================================================= */

  const openAddForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      durationHours: "",
      durationMinutes: "",
    });

    setEditId(null);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Service name is required";
    }

    if (!formData.category.trim()) {
      return "Category is required";
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      return "Enter a valid price";
    }

    const hours =
      formData.durationHours === ""
        ? 0
        : Number(formData.durationHours);

    const minutes =
      formData.durationMinutes === ""
        ? 0
        : Number(formData.durationMinutes);

    if (
      !Number.isInteger(hours) ||
      hours < 0 ||
      hours > 23
    ) {
      return "Hours must be between 0 and 23";
    }

    if (
      !Number.isInteger(minutes) ||
      minutes < 0 ||
      minutes > 59
    ) {
      return "Minutes must be between 0 and 59";
    }

    const totalDuration =
      hours * 60 + minutes;

    if (totalDuration < 1) {
      return "Duration must be at least 1 minute";
    }

    if (!formData.description.trim()) {
      return "Description is required";
    }

    return "";
  };

  /* =========================================================
     ADD / UPDATE SERVICE
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      showToast(validationError, "warning");
      return;
    }

    try {
      setSaving(true);

      const hours =
        formData.durationHours === ""
          ? 0
          : Number(formData.durationHours);

      const minutes =
        formData.durationMinutes === ""
          ? 0
          : Number(formData.durationMinutes);

      const totalDuration =
        hours * 60 + minutes;

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        duration: totalDuration,
      };

      if (editId) {
        await api.put(
          `/services/${editId}`,
          payload
        );

        showToast(
          "Service updated successfully",
          "success"
        );
      } else {
        await api.post(
          "/services",
          payload
        );

        showToast(
          "Service added successfully",
          "success"
        );
      }

      resetForm();

      await fetchServices();
    } catch (err) {
      console.error(
        "SERVICE SAVE ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to save service",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (service) => {
    const durationParts = getDurationParts(
      service.duration
    );

    setFormData({
      name: service.name || "",
      description: service.description || "",
      category: service.category || "",
      price: service.price ?? "",
      durationHours:
        durationParts.hours > 0
          ? String(durationParts.hours)
          : "",
      durationMinutes:
        durationParts.minutes > 0
          ? String(durationParts.minutes)
          : "",
    });

    setEditId(service._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/services/${id}`);

      showToast(
        "Service deleted successfully",
        "success"
      );

      await fetchServices();
    } catch (err) {
      console.error(
        "DELETE SERVICE ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to delete service",
        "error"
      );
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="admin-services-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="services-header">
        <div>
          <span>ADMIN PANEL</span>

          <h1>Service Management</h1>

          <p>
            Manage all services available on the platform.
          </p>
        </div>

        <button
          className="add-service-btn"
          onClick={openAddForm}
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (
        <div className="service-form-card">

          <div className="form-title">
            <div>
              <span>
                {editId
                  ? "UPDATE SERVICE"
                  : "NEW SERVICE"}
              </span>

              <h2>
                {editId
                  ? "Edit Service"
                  : "Add New Service"}
              </h2>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="close-form-btn"
              title="Close"
            >
              <X size={17} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            {/* FORM GRID */}

            <div className="form-grid">

              {/* SERVICE NAME */}

              <div className="form-group">
                <label>
                  Service Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Premium Haircut"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>

              {/* CATEGORY */}

              <div className="form-group">
                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  placeholder="Salon"
                  value={formData.category}
                  onChange={handleChange}
                  maxLength={50}
                  required
                />
              </div>

              {/* PRICE */}

              <div className="form-group">
                <label>
                  Price (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="300"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  required
                />
              </div>

              {/* DURATION */}

              <div className="form-group duration-group">
                <label>
                  Duration
                </label>

                <div className="duration-inputs">

                  <div className="duration-field">
                    <Clock3 size={14} />

                    <input
                      type="number"
                      name="durationHours"
                      placeholder="0"
                      value={
                        formData.durationHours
                      }
                      onChange={handleChange}
                      min="0"
                      max="23"
                      step="1"
                    />

                    <span>hr</span>
                  </div>

                  <div className="duration-field">
                    <Clock3 size={14} />

                    <input
                      type="number"
                      name="durationMinutes"
                      placeholder="0"
                      value={
                        formData.durationMinutes
                      }
                      onChange={handleChange}
                      min="0"
                      max="59"
                      step="1"
                    />

                    <span>min</span>
                  </div>

                </div>

                <small>
                  Example: 1 hr 30 min
                </small>
              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                rows="4"
                placeholder="Professional haircut and styling"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                required
              />

              <small>
                {formData.description.length}/500
              </small>

            </div>

            {/* FORM ACTIONS */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
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
                  "Update Service"
                ) : (
                  "Add Service"
                )}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* =================================================
          SERVICES CARD
      ================================================= */}

      <div className="services-card">

        <div className="card-heading">
          <div>
            <h2>
              All Services
            </h2>

            <p>
              View and manage available platform services.
            </p>
          </div>

          <span>
            {services.length}{" "}
            {services.length === 1
              ? "Service"
              : "Services"}
          </span>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="loading">

            <div className="service-spinner"></div>

            <p>
              Loading services...
            </p>

          </div>
        ) : services.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="empty-services">

            <div className="empty-service-icon">
              <Wrench size={25} />
            </div>

            <h3>
              No Services Found
            </h3>

            <p>
              Add your first service to get started.
            </p>

            <button
              onClick={openAddForm}
              className="empty-add-btn"
            >
              <Plus size={15} />
              Add Service
            </button>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="services-table-wrapper">

            <table className="services-table">

              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Provider</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {services.map((service) => (
                  <tr key={service._id}>

                    {/* SERVICE */}

                    <td>
                      <div className="service-name">

                        <div className="service-icon">
                          <Wrench size={18} />
                        </div>

                        <div>
                          <strong>
                            {service.name}
                          </strong>

                          <small>
                            {service.description ||
                              "No description"}
                          </small>
                        </div>

                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td>
                      <span className="category-badge">
                        {service.category}
                      </span>
                    </td>

                    {/* PRICE */}

                    <td>
                      <strong className="service-price">
                        ₹
                        {Number(
                          service.price || 0
                        ).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    {/* DURATION */}

                    <td>
                      <span className="service-duration">
                        <Clock3 size={13} />
                        {formatDuration(
                          service.duration
                        )}
                      </span>
                    </td>

                    {/* PROVIDER */}

                    <td>
                      {service.provider?.name ||
                        "Admin"}
                    </td>

                    {/* ACTION */}

                    <td>
                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(service)
                          }
                        >
                          <Pencil size={13} />
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              service._id
                            )
                          }
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default Services;
