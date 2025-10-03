import { useState } from "react";

export default function FormularioAlumno() {
  const [formData, setFormData] = useState({
    documento: "",
    nombre: "",
    apellidos: "",
    telefono: "",
    correo: "",
  });

  const [alumnos, setAlumnos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Guardar o editar alumno
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Editar alumno existente
      const alumnosActualizados = [...alumnos];
      alumnosActualizados[editIndex] = formData;
      setAlumnos(alumnosActualizados);
      setEditIndex(null);
    } else {
      // Agregar nuevo alumno
      setAlumnos([...alumnos, formData]);
    }

    // Limpiar formulario
    setFormData({
      documento: "",
      nombre: "",
      apellidos: "",
      telefono: "",
      correo: "",
    });
  };

  // Editar alumno
  const handleEdit = (index) => {
    setFormData(alumnos[index]);
    setEditIndex(index);
  };

  // Eliminar alumno
  const handleDelete = (index) => {
    const alumnosActualizados = alumnos.filter((_, i) => i !== index);
    setAlumnos(alumnosActualizados);
  };

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
      {/* Formulario */}
      <section style={{ flex: "1" }}>
        <h3 style={{ textAlign: "center" }}>Formulario</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
        >
          <label>
            Documento:
            <input
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Apellidos:
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Teléfono:
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Correo:
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </label>

          <button
            type="submit"
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "0.5rem",
            }}
          >
            {editIndex !== null ? "Actualizar" : "Registrar"}
          </button>

          <button
            type="reset"
            onClick={() =>
              setFormData({
                documento: "",
                nombre: "",
                apellidos: "",
                telefono: "",
                correo: "",
              })
            }
            style={{
              backgroundColor: "teal",
              color: "white",
              padding: "0.5rem",
            }}
          >
            Cancelar
          </button>
        </form>
      </section>

      {/* Lista de estudiantes */}
      <section style={{ flex: "2" }}>
        <h3 style={{ textAlign: "center" }}>Lista de estudiantes</h3>
        <table
          border="1"
          width="100%"
          style={{ borderCollapse: "collapse", textAlign: "center" }}
        >
          <thead>
            <tr>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.length > 0 ? (
              alumnos.map((alumno, index) => (
                <tr key={index}>
                  <td>{alumno.documento}</td>
                  <td>{alumno.nombre}</td>
                  <td>{alumno.apellidos}</td>
                  <td>{alumno.correo}</td>
                  <td>{alumno.telefono}</td>
                  <td>
                    <button
                      style={{
                        backgroundColor: "skyblue",
                        margin: "0 4px",
                        padding: "0.3rem",
                      }}
                      onClick={() => handleEdit(index)}
                    >
                      Editar
                    </button>
                    <button
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "0.3rem",
                      }}
                      onClick={() => handleDelete(index)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay estudiantes registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
