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
=> Poner loaders ✓
=> Ver que las autorizaciones estén activadas en las rutas ✓


Subir archivos: 
=> Responsive, que en el celu en vez de "descargar archivo haya un icono de una flecha ✓
=> Arreglar la fecha ✓
=> función borrar archivo ✓
=> alinear la tabla ✓
=> validar que si el nombre es el mismo diga que está repetido y no lo suba ✓
=> ordenar por fecha decreciente
=> ver permisos para que el alumno solo lo pueda ver si está anotado en esa clase ✓
=> mail de verificación cuando se subió el tp con los datos de subida (originalname, clase, fecha) ✓
=> borrar tps (alumno) ✓
=> el tp no se borra del array del alumno cuando elimino el archivo ✓


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


Etapa 4 - integración:
=> poner timer en los Swal ✓
=> Ver asistencias alumno ✓
=> Subir tp alumno ✓
=> Subir material admin ✓
=> Ver material alumno ✓
=> ver tps admin
=> vista de pagos por mes en admin y de historial de pagos de alumno en info de alumno ✓
=> editar y borrar clase ✓
=> editar y borrar pagos ✓
=> certificado de alumno regular ✓

Errores: 
=> Cuando se agrega un alumno a una clase no se refresca automático ✓
=> Solo se ven las asistencias del alumno si ya faltó ✓
=> No borra al usuario cuando borro al alumno de la base de datos ✓
=> Cuando se registra un alumno no aparece automaticamente en la lista ✓
=> Si no tiene sesión iniciada queda en loader, poner un timer de 10 segundos y volver al inicio ✓
=> Se ve el loader cuando voy a cambiar contraseña (permisos en app) ✓
=> poner mail dinamico en registrar usuario ✓
=> Poner loaders en iniciar sesión, registrarse, enviar mail, reset pass ✓
=> permitir que el admin pueda cambiar la contraseña sin estar registrado como alumno ✓
=> Asegurarse de que se vea un forbidden o mandar a login si no tiene los permisos (sin login) ✓
=> Ver mensaje de "admin conectado" ✓
=> Sacar la casita ✓
=> Error de autorización para ver los alumnos anotados en una clase (admin) o al refrescar la página ✓
=> ver que no se pueda mandar un pago nulo en cargar pagos admin ✓
=> poder eliminar certificados? se ve solo el primero por año
=> perfil de alumno en movil ✓
=> cambiar el año por default dinamico a todas las vistas (buscar useState(2025)) ✓
=>permitir ver pdf en cloudinary ✓
=> Poner loaders en las vistas de alumno ✓

Final:
=> Chequear todos los Swal para el manejo de errores
=> agregar , { withCredentials: true } a las rutas de front (no)
=> Borrar logs
=> Cambiar los "error" en las rutas de los catch por "error del servidor" ✓
=> Ver mayúsculas y minúsculas y espacios cuando agrego a un alumno a la clase (registro en lower, login en lower, cambio contraseña en lower, registrar alumno upper, cargar alumno upper, cargar clase upper, email recuperar contraseña lower) ✓
=> en cambiar contraseña puedo poner cualquier mail y lo toma como correcto
=> Se traba al registrarse si se edita el mail ✓
=> foto de perfil de alumnos?
=> el cartel de asistencias registradas correctamente dura muy poco
=> no anda el registro en el deploy ✓
=> volver a cambiar el mail de admin 2
=> fijarse que passportcall y auth no hayan quedado comentados en ninguna ruta ✓
=>Borrar todo de la base de datos de producción ✓
=> largo del container de mensaje bienvenida alumno 
=> si se elimina un alumno, eliminar sus notas, asistencias, certificados, tps, pagos, usuario ✓
=> si se elimina una clase, eliminar el material ✓
=> si modifico una clase y le cambio el nombre la genera como nueva ✓
=> las notas no se borran luego de cargarlas ✓
=> si ya se mando una nota, cambiar el boton enviar por editar y hacer un put (igual que en pagos) ✓
=> modificar los pick de fechas ✓
=> error del servidor en material didactico alumnos ✓
=> no registra los presentes hasta que no tiene un ausente ✓
=> si voy para atras desde el link de la pag del circo me muestra el cartel de unauthorized ✓
=> si no pongo nada en el casillero de notas se guarda la ultima nota del otro alumno ✓
=> boton eliminar notas ✓
=> ordenar notas por apellido del alumno ✓
=> si elimino un alumno me aparece el estado de no hay ningun alumno ✓

=> tamaño de archivos en cloudinary
=> párrafo descriptivo en el material subido ✓
=> subir links en cargar material y en tp ✓
=> borrar el material en cloudinary cuando se elimina un archivo? 

=> cambiar lo de secure y sameSite en index


TODO: 
vista alumno de tps. Si hay nota se muestra con devolución, y se desactiva el botón de eliminar archivo

vista admin filtrado por clase y agrupar por alumno

diseño responsive