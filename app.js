require('colors');

const { guardarDB,
        leerDB
      } = require('./helpers/guardarArchivo');
const { inquirerMenu,
        pausa,
        leerInput,
        listadoTaresBorrar,
        confirmar,
        mostrarListadoCheckList
    } = require('./helpers/inquirer');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');


//const { mostrarMenu, pausa } = require('./helpers/mensajes');



console.clear();
const main = async() => {

    console.log('Hola Mundo!');
    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if( tareasDB ) {
        // Establecer las tareas
        tareas.cargarTareasFromArray(tareasDB);
    }
    
    
    do {
        opt = await  inquirerMenu();
       
        switch ( opt ) {
            case '1':
                // crear opcion
                const desc = await leerInput('Descripción');
                tareas.crearTarea( desc );
            break;
            case '2':
                tareas.listadoCompleto();
            break;
            case '3':
                tareas.listarPendientesCompletadas( true );
            break;
            case '4':
                tareas.listarPendientesCompletadas( false );
            break;
            case '5':
                const ids = await mostrarListadoCheckList( tareas.listadoArr );
                tareas.toggleCompletadas(ids);
            break;
            case '6':
                const id = await listadoTaresBorrar( tareas.listadoArr );
                if ( id !== '0' ){
                    const ok = await confirmar('¿Está seguro?');
                    if( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada ');
                    }
                }
                
            break;

        }
        guardarDB(tareas.listadoArr );


        await pausa();

    } while ( opt !== '0' );

}

main();