import { Command } from "commander";

const program = new Command();
//para cambiar de modo: nodemon index.js --mode prod
program
  .option("-d", "Varaible para debug", false) //primero va la variable, luego la descripcion y al final puede ir un valor por defecto.
  .option("-p <port>", "Puerto del servidor", 9090)
  .option("--mode <mode>", "Modo de trabajo", "dev")
  .option("--persist <persist>", "Modo de persistencia", "mongodb")

  .requiredOption(
    "-u <user>",
    "Usuario que va a utilizar el aplicativo.",
    "No se ha declarado un usuario."
  ); //RequireOption usa un mensaje por defecto si no está presente la opción.
program.parse(); //Parsea los comandos y valida si son correctos.

export default program;
