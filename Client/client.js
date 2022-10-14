/*Importacion de modulos que deben estar previamente instalados*/
const express = require("express");
const {cyan, bgRed} = require("chalk");
const listen = require("socket.io");
const MongoClient = require("mongodb").MongoClient;
const {AttributeIds, OPCUAClient, TimestampsToReturn} = require("node-opcua");

/*fluxdb*/

const {InfluxDB, Point, HttpError} = require('@influxdata/influxdb-client');
const { write } = require("fs");

// You can generate an API token from the "API Tokens Tab" in the UI
// const token = "454wCH4qnPl5ReIbGOcEkxn_VRcl3a1JxMpG7SUWibwtD-qvhEFw9ue7d9yXbdovcl9X4XoklZQBQX7fPtcJPA==";
// const org = "rengifojeanpaul@gmail.com";
// const bucket = "Temperatura Extrusor";




/*Creacion de constantes*/
const endpointUrl ="opc.tcp://raspberrypi:4334/UA/MainServerAAS";
const nodeIdTb="ns=1;i=2022";
const nodeIdTe="ns=1;i=2023";
const nodeIdTm="ns=1;i=2024";

/*Aplicacion web*/
const port ="3700";

/*Base de datos*/
const uri = "mongodb+srv://jean:jeparego@cluster0.hlnbl.mongodb.net/?retryWrites=true&w=majority";
const clientemongo = new MongoClient(uri, { useNewUrlParser: true});

// const clienteflux = new InfluxDB({url: "https://us-east-1-1.aws.cloud2.influxdata.com", token: token});
// const writeApi = clienteflux.getWriteApi(org, bucket);

(async () => {
    try{
        //crear cleinte OPC UA
        const client = OPCUAClient.create();
        //avisar cuando se esta intentando conectar
        client.on("backoff", (retry, delay) =>{
            console.log("Retrying to connect to ", endpointUrl, " attempt ", retry);
        } );
        //mostrar las URL cuando logre conectar
        console.log( " connecting to", cyan(endpointUrl));
        await client.connect(endpointUrl);
        // iniciar la sesion para interactuar con el servidor
        const session = await client.createSession();
        console.log(" session started");
        //crear una suscripcion
        const subscription = await session.createSubscription2({
            requestedPublishingInterval: 200,
            requestedMaxKeepAliveCount: 20,
            publishingEnabled: true,
        });
        //crear objeto de nodo a medir con Id y atributo
        const sensorTb = {
            nodeId: nodeIdTb,
            attributeId: AttributeIds.Value
        };


        const sensorTe= {
            nodeId: nodeIdTe,
            attributeId: AttributeIds.Value
        };
        const sensorTm = {
            nodeId: nodeIdTm,
            attributeId: AttributeIds.Value
        };
        //parametros de monitoreo
        const parametersTb = {
            samplingInterval: 50,
            discardOldest: true,
            queueSize: 50
        };
        //objeto encargado de hacer el monitoreo de la variable
        const monitoredItem = await subscription.monitor(sensorTb, parametersTb, TimestampsToReturn.Both);
        
        // crear app

        const app = express();
        app.set("view engine", "html");

        //definir directorios de estaticos
        app.use(express.static(__dirname + '/'));
        app.set('views', __dirname + '/');
        app.get("/", function(req, res){
            res.render("index.html");
        }
        );

        //comunicacion bidireccional en tiempo real basada en eventos socket.io
        //asociar el puerto a la app web
        const io = listen(app.listen(port));
        io.sockets.on('connection', function(socket){
        });
        //mostrar el url para la aplicaicon web
        console.log("Listening on port  " +port);
        console.log("visit http://localhost:" + port);
        

        //conectar el cliente
        await clientemongo.connect();
        
        
        // onectarse a la coleccion con los datos
        await clientemongo.db("mydb").dropCollection("Tb");
        await clientemongo.db("mydb").dropCollection("Te");
        await clientemongo.db("mydb").dropCollection("Tm");
        
        console.log("Aqui voy");
        const collection_Tb = clientemongo.db("mydb").collection("Tb");
        const collection_Te = clientemongo.db("mydb").collection("Te");
        const collection_Tm = clientemongo.db("mydb").collection("Tm");
        
        
        // monitoredItem.on("changed", (dataValue)=>{
        //     //escribir base de datos
        //     collection_Te.insertOne({
        //         valor: dataValue.value.value,
        //         time: dataValue.serverTimestamp
        //     });
        //     console.log(" value has changed : ", dataValue.value.toString());
        //     io.sockets.emit("message", 
        //         {value: dataValue.value.value, 
        //         timestamp: dataValue.serverTimestamp,
        //         nodeId: nodeIdn1,
        //     });
        //     // const point = new Point('mem').tag('host', 'host1').floatField('used_percent', dataValue.value.value);
        //     // writeApi.writePoint(point);
        //     // writeApi.flush();
        // });

        setInterval(async function () {
            const maxAge = 0;
            const dataValueTb = await session.read(sensorTb, maxAge);
            const dataValueTe = await session.read(sensorTe, maxAge);
            const dataValueTm = await session.read(sensorTm, maxAge);
            //escribir base de datos
            console.log("Datos a transmitir:")
            collection_Tb.insertOne({
                valor: dataValueTb.value.value,
                time: dataValueTb.serverTimestamp
            });
            collection_Te.insertOne({
                valor: dataValueTe.value.value,
                time: dataValueTe.serverTimestamp
            });
            collection_Tm.insertOne({
                valor: dataValueTm.value.value,
                time: dataValueTm.serverTimestamp
            });
            console.log("Tb: ", dataValueTb.value.value.toString());
            console.log("Tm: ", dataValueTm.value.value.toString());
            console.log("Te: ", dataValueTe.value.value.toString());
            console.log("Datos transmitidos")
            
            
            // io.sockets.emit("message", 
            //     {value: dataValue.value.value, 
            //     timestamp: dataValue.serverTimestamp,
            //     nodeId: nodeIdn1,
            //  });
            // const point = new Point('mem').tag('host', 'host1').floatField('used_percent', dataValue.value.value);
            // writeApi.writePoint(point);
            // writeApi.flush();
        }, 5000);
        
        //poder salir
        process.on ("SIGINT", async()=>{
            // await writeApi
            // .close()
            // .then(() => {
            //     console.log('FINISHED');
            //     })
            // .catch(e => {
            // console.error(e);
            // });
            console.log("shutting down client");
            await clientemongo.close();
            await subscription.terminate();
            await session.close();
            await client.disconnect();
            console.log("done finally");
            process.exit(0);
        });
        console.log("aqui");

    }
    catch(err){
        console.log(bgRed.yellow("Error "+ err.message));
        console.log(err);
        process.exit(-1);
    }

})();