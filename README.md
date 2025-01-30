El alta del alumno se hace por admin ✓
El alumno puede iniciar sesión sólo si su email está en la db de alumno ✓
El alumno puede ver su info de contacto pero no modificarla ✓

Mandar un mail al alumno como comprobante cuando se modifica el casillero de pago

Agregar una vista de admin para armar la lista de alumnos en cada clase ✓
Dentro de esta vista, poder agregar una clase desde el selector de clase, agregándole año y profesor


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

=> Nuevo env dev
=> Chequear todos los Swal para el manejo de errores
=> Poner loaders


Falta en admin: 
=> Editar alumno ✓
=> Agregar "observaciones" en alumno?
=> Asistencias múltiples ✓
=> Subir material

Inicio de sesión:
=> si no carga en 5 segundos mandarlo al login
=> el setRolUsuario queda atrasado ✓
=> Ver CORS ✓
=> Autorización en todas las vistas (faltan en alumno), ver cómo desautorizar también en las de front, no solo las de back ✓
=> En todas las vistas atajar el error por autorización inválida ✓
=> Mail para cambiar contraseña
=> Mail para confirmar registro y cuando se cambia la contraseña
=> Loader en login ✓
=> poner logout como función y no como componente ✓ 

Validaciones :
=> agregar , { withCredentials: true } a las rutas de front
=> Agregar alumno a la clase: el alumno no puede estar repetido

Errores: 
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