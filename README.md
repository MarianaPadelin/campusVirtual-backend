El alta del alumno se hace por admin ✓
El alumno puede iniciar sesión sólo si su email está en la db de alumno ✓
El alumno puede ver su info de contacto pero no modificarla ✓

Mandar un mail al alumno como comprobante cuando se modifica el casillero de pago ✓

Agregar una vista de admin para armar la lista de alumnos en cada clase ✓
Dentro de esta vista, poder agregar una clase desde el selector de clase, agregándole año y profesor ✓


--Para mandar el front:
=> diseño responsive ✓
=> .env de la ruta del backend ✓
=> limpiar la db de alumnos ✓
=> crear vista inicio de sesión en el home ✓
=> crear card con info de alumno ✓
=> agregar un loader ✓
=> Atajar el error de clases inexistentes ✓
=> Verificar que los pagos y notas sean únicamente numéricos en admin ✓
=> Sacar el selector de mes y poner función de fecha en pagos admin ✓

=> Nuevo env dev ✓
=> Chequear todos los Swal para el manejo de errores
=> Poner loaders


Falta en admin: 
=> Editar alumno ✓
=> Agregar "observaciones" en alumno?
=> Asistencias múltiples ✓
=> Subir material ✓
=> Subir certificado de alumno regular


Subir archivos: 
=> Responsive, que en el celu en vez de "descargar archivo haya un icono de una flecha
=> Arreglar la fecha ✓
=> función borrar archivo ✓
=> alinear la tabla ✓
=> validar que si el nombre es el mismo diga que está repetido y no lo suba ✓
=> ordenar por fecha decreciente
=> ver permisos para que el alumno solo lo pueda ver si está anotado en esa clase ✓
=> mail de verificación cuando se subió el tp con los datos de subida (originalname, clase, fecha)
=> borrar tps (alumno)
=> el tp no se borra del array del alumno cuando elimino el archivo


Inicio de sesión:
=> si no carga en 5 segundos mandarlo al login ✓
=> el setRolUsuario queda atrasado ✓
=> Ver CORS ✓
=> Autorización en todas las vistas (faltan en alumno), ver cómo desautorizar también en las de front, no solo las de back ✓
=> En todas las vistas atajar el error por autorización inválida ✓
=> Mail para cambiar contraseña ✓
=> Mail para confirmar registro y cuando se cambia la contraseña ✓
=> Loader en login ✓
=> poner logout como función y no como componente ✓ 

Validaciones :
=> agregar , { withCredentials: true } a las rutas de front
=> Agregar alumno a la clase: el alumno no puede estar repetido (y poner nombre y apellido, no solo apellido) ✓

Etapa 4 - integración:
=> Ver mayúsculas y minúsculas y espacios cuando agrego a un alumno a la clase
=> poner timer en los Swal ✓
=> Si un alumno no está registrado me aparece "usuario y contraseña incorrectos" ✓
=> si quiero agregar alumnos de una clase no registrada me aparece "error desconocido" 
=> Enviar un mail cuando se actualicen las notas del alumno?
=> Sección "ver perfil" en el alumno para editar sus datos 
=> Ver asistencias alumno ✓
=> Subir tp alumno
=> Subir material admin
=> Ver material alumno

Errores: 
=> Solo se ven las asistencias del alumno si ya faltó ✓
=> No borra al usuario cuando borro al alumno de la base de datos ✓
=> Cuando se registra un alumno no aparece automaticamente en la lista ✓
=> Si no tiene sesión iniciada queda en loader, poner un timer de 10 segundos y volver al inicio ✓
=> en cambiar contraseña puedo poner cualquier mail y lo toma como correcto
=> Se ve el loader cuando voy a cambiar contraseña (permisos en app) ✓
=> poner mail dinamico en registrar usuario ✓
=> Poner loaders en iniciar sesión, registrarse, enviar mail, reset pass ✓
=> permitir que el admin pueda cambiar la contraseña sin estar registrado como alumno ✓
=> Asegurarse de que se vea un forbidden o mandar a login si no tiene los permisos (sin login) ✓
=> Ver mensaje de "admin conectado" ✓
=> Sacar la casita ✓
=> Se traba al registrarse si se edita el mail
=> Error de autorización para ver los alumnos anotados en una clase (admin)