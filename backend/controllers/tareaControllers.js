import Proyecto from '../models/Proyecto.js'
import Tarea from '../models/Tarea.js';

const agregarTarea = async (req, res) => {
   const { proyecto } = req.body;
   
   try {
    const existeProyecto = await Proyecto.findById(proyecto)

    if(existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('No tienes los permisos adecuados para añadir tareas');
        return res.status(403).json({msg: error.message})
    }

        try {
            const tareaAlmacenada = await Tarea.create(req.body);
            res.json(tareaAlmacenada)
        } catch (error) {
            console.log(error)
        }

   } catch (error) {
    error.message = 'El proyecto no existe';
    return res.status(404).json({msg: error.message})
   }

   


};

const obtenerTarea = async (req, res) => {
    const { id } = req.params;
    try {
        const tarea = await Tarea.findById(id).populate("proyecto");
    
      if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error('Acción no válida');
            return res.status(403).json({msg: error.message})
      }
     res.json(tarea);
    } catch (error) {
        error.message = 'Tarea no encontrada';
        return res.status(404).json({msg: error.message})
    }
};
 
const actualizarTarea = async (req, res) => {
    const { id } = req.params;
    try {
        const tarea = await Tarea.findById(id).populate("proyecto");
    
      if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error('Acción no válida');
            return res.status(403).json({msg: error.message})
      }
      
        tarea.nombre = req.body.nombre || tarea.nombre;
        tarea.descripcion = req.body.descripcion || tarea.descripcion;
        tarea.prioridad = req.body.prioridad || tarea.prioridad;
        tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

        try {
            const tareaAlmacenada = await tarea.save()
            res.json(tareaAlmacenada)
        } catch (error) {
            console.log(error)
        }

    } catch (error) {
        error.message = 'Tarea no encontrada';
        return res.status(404).json({msg: error.message})
    }
};
 
const eliminarTarea = async (req, res) => {
    const { id } = req.params;
    try {
        const tarea = await Tarea.findById(id).populate("proyecto");
    
      if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error('Acción no válida');
            return res.status(403).json({msg: error.message})
      }
        try {
            await tarea.deleteOne();
            res.json({msg: 'Tarea Eliminada'})
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        error.message = 'Tarea no encontrada';
        return res.status(404).json({msg: error.message})
    }
};
 
const cambiarEstado = async (req, res) => {};

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}
 