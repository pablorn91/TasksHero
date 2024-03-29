import { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/clienteAxios'
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {

    const [ proyectos, setProyectos ] = useState([])
    const [ alerta, setAlerta ] = useState({})
    const [ proyecto, setProyecto ] = useState({})
    const [ cargando, setCargando ] = useState(false)
    const [modalFormTarea, setModalFormTarea ] = useState(false)
    const [ tarea, setTarea ] = useState({})
    const [ modalEliminarTarea, setModalEliminarTarea ] = useState(false)
    const [ colaborador, setColaborador ] = useState({})
    const [ modalELiminarColaborador, setModalELiminarColaborador ] = useState(false)
    const [ buscador, setBuscador ] = useState(false)

    const navigate = useNavigate()
    const { auth } = useAuth()

    useEffect(() => {
        const obtenerProyectos = async () => {
            
            setCargando(true)
            try {
                const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios('/proyectos',  config)
            
            setProyectos(data)
            } catch (error) {
               console.log(error) 
            }
            setCargando(false)
           
        }
        obtenerProyectos()
    }, [auth])

    const mostrarAlerta = alerta => {
        setAlerta(alerta)

        setTimeout(() => {
            setAlerta({})
        }, 4000);
    }

    const submitProyecto = async proyecto => {

        if(proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }
        
    }

    const editarProyecto = async proyecto => {
       try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            
            //Sincronizar el state
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState );
            setProyectos(proyectosActualizados)

            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            })
            
            setTimeout(() => {
                setAlerta({})

                navigate('/proyectos')
            }, 3000);

       } catch (error) {
           console.log(error)
       }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos', proyecto, config)

            setProyectos([...proyectos, data])

            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })
            
            setTimeout(() => {
                setAlerta({})

                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            conosole.log(error)
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true)

        try {
            const token = localStorage.getItem('token')
           if (!token) return

           const config = {
               headers: {
                   "Content-Type": "application/json",
                   Authorization: `Bearer ${token}`
               }
           }
           const { data } = await clienteAxios(`/proyectos/${id}`, config)
           setProyecto(data)
           setAlerta({})
           
       } catch (error) {
           navigate('/proyectos')
           setAlerta({
               msg: error.response.data.msg,
               error: true
           })
           setTimeout(() => {
               setAlerta({})
           }, 2000);
       } finally {
           setTimeout(() => {
               setCargando(false)
           }, 100);
       }
    }

    const eliminarProyecto = async id => {
        try {

            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

            setAlerta({
                msg: data.msg,
                error: false
            })

            //sincronizar state

            const proyectosActualizados = proyectos.filter( proyectoState => proyectoState._id !== id )

            setProyectos(proyectosActualizados)

            setTimeout(() => {
                setAlerta({})

                navigate('/proyectos')
            }, 3000);


            
        } catch (error) {
            console.log(error)         
        }
    }

     const handleModalTarea = () => {
         setModalFormTarea(!modalFormTarea)
         setTarea({})
     }   
     
     const handleModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFormTarea(true)
     }
     
     const handleModalEliminarTarea = tarea => {
         setModalEliminarTarea(!modalEliminarTarea)
         setTarea(tarea)
     }      
     
     const eliminarTarea = async () => {
         try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({
                msg: data.msg,
                error: false
            })

            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
            setProyecto(proyectoActualizado)
            setModalEliminarTarea(false)
            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 3000);
         } catch (error) {
             console.log(error)
         }
     }
     const submitTarea = async tarea => {

        if(tarea?.id) {
            await editarTarea(tarea)
        } else {
           await crearTarea(tarea)
        }
     }

     const crearTarea = async tarea => {

        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/tareas', tarea, config)

            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = [... proyecto.tareas, data]
            setProyecto(proyectoActualizado)
            setAlerta({})
            setModalFormTarea(false)
            
        } catch (error) {
            console.log(error)
        }
     }

     const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === data._id ? data : tareaState)
            
            setProyecto(proyectoActualizado)
            setAlerta({})
            setModalFormTarea(false)

        } catch (error) {
            console.log(error)
        }
     }

     const submitColaborador = async email => {
         setCargando(true)
            try {
                const token = localStorage.getItem('token')
                if (!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios.post('/proyectos/colaboradores',{email}, config)

                setColaborador(data)
                setAlerta({})

            } catch (error) {
               setAlerta({
                    msg: error.response.data.msg,
                    error: true
               })
            } finally {
                setCargando(false)
            }
     }

     const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`,email, config)
            
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
                navigate(`proyectos/${proyecto._id}`)
            }, 2000);

            
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
     }
     
     const handleModalEliminarColaborador = colaborador => {
         setModalELiminarColaborador(!modalELiminarColaborador)
         setColaborador(colaborador)
        }
        
        const eliminarColaborador = async () => {
         try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`,{id: colaborador._id}, config)

            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter( colaboradorState => colaboradorState._id !== colaborador._id)

            setProyecto(proyectoActualizado)

            setAlerta({
                msg: data.msg,
                error: false
            })
            setTimeout(() => {
                setAlerta({})
            }, 2000);
            setColaborador({})
            setModalELiminarColaborador(false)

        } catch (error) {
            console.log(error.response)
        }
     }

     const completarTarea = async id => {
         try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
            
            const proyectoActualizado = {...proyecto}

            proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === data._id ? data : tareaState )

            setProyecto(proyectoActualizado)
            setTarea({})
            setAlerta({})

         } catch (error) {
             console.log(error.response)
         }
     }

     const handleBuscador = () => {
         setBuscador(!buscador)
     }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                alerta,
                mostrarAlerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalELiminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador
            }}
        >{children}
        </ProyectosContext.Provider>
    )

}

export {
    ProyectosProvider
}

export default ProyectosContext