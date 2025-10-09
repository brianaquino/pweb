import { useState, useEffect } from "react";

export default function FormularioAlumno() {
  const [formData, setFormData] = useState({
    documento: "",
    nombre: "",
    apellidos: "",
    telefono: "",
    correo: "",
  });

  const [alumnos, setAlumnos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const API_URL = "http://localhost:3000/api/usuarios";

  // Cargar alumnos al iniciar
  useEffect(() => {
    cargarAlumnos();
  }, []);

  // Obtener todos los alumnos desde la API
  const cargarAlumnos = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setAlumnos(data);
      } else {
        mostrarMensaje("Error al cargar estudiantes", "error");
      }
    } catch (error) {
      mostrarMensaje("Error de conexión: " + error.message, "error");
      console.error("Error:", error);
    }
  };

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Guardar o editar alumno
  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosEnviar = {
      ...formData,
      fecha_creacion: new Date().toISOString().split('T')[0]
    };

    try {
      if (editId !== null) {
        // Actualizar alumno existente (PUT)
        const response = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosEnviar),
        });

        if (response.ok) {
          mostrarMensaje("✅ Estudiante actualizado correctamente", "success");
          setEditId(null);
        } else {
          const error = await response.json();
          mostrarMensaje("❌ " + (error.mensaje || "Error al actualizar"), "error");
        }
      } else {
        // Crear nuevo alumno (POST)
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosEnviar),
        });

        if (response.ok) {
          mostrarMensaje("✅ Estudiante registrado correctamente", "success");
        } else {
          const error = await response.json();
          mostrarMensaje("❌ " + (error.mensaje || "Error al registrar"), "error");
        }
      }

      // Recargar lista y limpiar formulario
      await cargarAlumnos();
      limpiarFormulario();
    } catch (error) {
      mostrarMensaje("❌ Error de conexión: " + error.message, "error");
      console.error("Error:", error);
    }
  };

  // Editar alumno
  const handleEdit = (alumno) => {
    setFormData({
      documento: alumno.documento,
      nombre: alumno.nombre,
      apellidos: alumno.apellidos,
      telefono: alumno.telefono,
      correo: alumno.correo,
    });
    setEditId(alumno.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Eliminar alumno
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este estudiante?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mostrarMensaje("✅ Estudiante eliminado correctamente", "success");
        await cargarAlumnos();
      } else {
        const error = await response.json();
        mostrarMensaje("❌ " + (error.mensaje || "Error al eliminar"), "error");
      }
    } catch (error) {
      mostrarMensaje("❌ Error de conexión: " + error.message, "error");
      console.error("Error:", error);
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      documento: "",
      nombre: "",
      apellidos: "",
      telefono: "",
      correo: "",
    });
    setEditId(null);
  };

  // Mostrar mensajes
  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(""), 4000);
  };

  return (
    <div style={{ 
      display: "flex", 
      gap: "2rem", 
      padding: "1rem", 
      fontFamily: "Arial, sans-serif", 
      backgroundColor: "gray", 
      minHeight: "100vh",
      width: "100vw",
      boxSizing: "border-box",
      position: "absolute",
      top: 0,
      left: 0
    }}>
      {/* Mensaje de notificación */}
      {mensaje && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "1rem 1.5rem",
            backgroundColor: mensaje.tipo === "success" ? "#4caf50" : "#f44336",
            color: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Formulario */}
      <section style={{ flex: "1", minWidth: "300px" }}>
        <h3 style={{ textAlign: "center", color: "#333" }}>
          {editId ? "✏️ Editar Estudiante" : "📝 Nuevo Estudiante"}
        </h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <strong>Documento:</strong>
            <input
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              required
              style={{ padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <strong>Nombre:</strong>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              style={{ padding: "0.6rem", border: "1px solid #000000ff", borderRadius: "4px" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <strong>Apellidos:</strong>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              style={{ padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <strong>Teléfono:</strong>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              style={{ padding: "0.6rem", border: "1px solid #000000ff", borderRadius: "4px" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <strong>Correo:</strong>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              style={{ padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px" }}
            />
          </label>

          <button
            type="submit"
            style={{
              backgroundColor: editId ? "#2196F3" : "#4caf50",
              color: "white",
              padding: "0.7rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {editId !== null ? "💾 Actualizar" : "✅ Registrar"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={limpiarFormulario}
              style={{
                backgroundColor: "#9e9e9e",
                color: "white",
                padding: "0.7rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              ❌ Cancelar Edición
            </button>
          )}
        </form>
      </section>

      {/* Lista de estudiantes */}
      <section style={{ flex: "2", minWidth: "500px" }}>
        <h3 style={{ textAlign: "center", color: "#ffffffff" }}>
          👥 Lista de Estudiantes ({alumnos.length})
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table
            border="1"
            width="100%"
            style={{ 
              borderCollapse: "collapse", 
              textAlign: "center",
              backgroundColor: "gray",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#5e5e5eff" }}>
                <th style={{ padding: "0.8rem" }}>Documento</th>
                <th style={{ padding: "0.8rem" }}>Nombre</th>
                <th style={{ padding: "0.8rem" }}>Apellidos</th>
                <th style={{ padding: "0.8rem" }}>Correo</th>
                <th style={{ padding: "0.8rem" }}>Teléfono</th>
                <th style={{ padding: "0.8rem" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.length > 0 ? (
                alumnos.map((alumno) => (
                  <tr key={alumno.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "0.6rem" }}>{alumno.documento}</td>
                    <td style={{ padding: "0.6rem" }}>{alumno.nombre}</td>
                    <td style={{ padding: "0.6rem" }}>{alumno.apellidos}</td>
                    <td style={{ padding: "0.6rem" }}>{alumno.correo}</td>
                    <td style={{ padding: "0.6rem" }}>{alumno.telefono}</td>
                    <td style={{ padding: "0.6rem" }}>
                      <button
                        style={{
                          backgroundColor: "#2196F3",
                          color: "white",
                          margin: "0 4px",
                          padding: "0.4rem 0.8rem",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleEdit(alumno)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        style={{
                          backgroundColor: "#f44336",
                          color: "white",
                          padding: "0.4rem 0.8rem",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDelete(alumno.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: "2rem", color: "#999" }}>
                    📋 No hay estudiantes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}