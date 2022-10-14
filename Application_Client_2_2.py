import asyncio
import sys
# sys.path.insert(0, "..")
import logging
import threading
from tkinter import *
from PIL import ImageTk, Image
from tkinter import messagebox
from tkinter import filedialog
import time
from asyncua import Client, Node, ua

logging.basicConfig(level=logging.INFO)
_logger = logging.getLogger('asyncua')

root = Tk()
root.title("Visor AAS Impresora 3D PRUSA")

assetkind = 1
ttitle=12
tsubtitle=11
tsubsubtitle=10
margen=2

 ## --- Asset Adminstration Shell scope ---
aas = LabelFrame(root, text="Asset Administration Shell", padx=margen, pady=margen, font=("Times",ttitle))
aas.grid(row=0, column=0, sticky=W+E)
aasi = LabelFrame(aas, text="Identification", padx=margen, pady=margen, font=("Times",tsubtitle))
aasi.grid(row=0, column=0)
aasad = LabelFrame(aas, text="Administration", padx=margen, pady=margen, font=("Times",tsubtitle))
aasad.grid(row=0, column=1)
aasiid = LabelFrame(aasi, text="Id", padx=margen, pady=margen, font=("Times",tsubsubtitle))
aasiid.grid(row=0, column=0)
aasiidtype = LabelFrame(aasi, text="IdType", padx=margen, pady=margen, font=("Times",tsubsubtitle))
aasiidtype.grid(row=0, column=1)
aasadversion = LabelFrame(aasad, text="Version", padx=margen, pady=margen, font=("Times",tsubsubtitle))
aasadversion.grid(row=0, column=0)
aasadrevision = LabelFrame(aasad, text="Revision", padx=margen, pady=margen, font=("Times",tsubsubtitle))
aasadrevision.grid(row=0, column=1)
aasiidvalue = Label(aasiid, text="Id", padx=margen, pady=margen)
aasiidvalue.grid(row=0, column=0)
aasiidtypevalue = Label(aasiidtype, text="IdType", padx=margen, pady=margen)
aasiidtypevalue.grid(row=0, column=1)
aasadversionvalue = Label(aasadversion, text="Version", padx=margen, pady=margen)
aasadversionvalue.grid(row=0, column=0)
aasadrevisionvalue = Label(aasadrevision, text="Revision", padx=margen, pady=margen)
aasadrevisionvalue.grid(row=0, column=1)

## --- Asset scope

asset = LabelFrame(root, text= 'Asset ' + '(' + str(assetkind) + ':'+ ' Instance)' , padx=margen, pady=margen, font=("Times",ttitle))
asset.grid(row=0, column=1, sticky=W+E)
asseti = LabelFrame(asset, text="Identification", padx=margen, pady=margen, font=("Times",tsubtitle))
asseti.grid(row=0, column=0)
assetim = LabelFrame(asset, text="Identification Model", padx=margen, pady=margen, font=("Times",tsubtitle))
assetim.grid(row=0, column=1)
assetiid = LabelFrame(asseti, text="Id", padx=margen, pady=margen, font=("Times",tsubsubtitle))
assetiid.grid(row=0, column=0)
assetiidtype = LabelFrame(asseti, text="IdType", padx=margen, pady=margen, font=("Times",tsubsubtitle))
assetiidtype.grid(row=0, column=1)
assetimkeys = LabelFrame(assetim, text="Keys", padx=margen, pady=margen, font=("Times",tsubsubtitle))
assetimkeys.grid(row=0, column=0) 
assetiidvalue = Label(assetiid, text="Id", padx=margen, pady=margen)
assetiidvalue.grid(row=0, column=0)
assetiidtypevalue = Label(assetiidtype, text="IdType", padx=margen, pady=margen)
assetiidtypevalue.grid(row=0, column=1)
assetimkeysvalue = Label(assetimkeys, text="Version", padx=margen, pady=margen)
assetimkeysvalue.grid(row=0, column=0)

## --- Submodels scope



## --- Submodel Identification

subident = LabelFrame(root, text= 'Submodelo Identificación' , padx=margen, pady=margen, font=("Times",ttitle))
subident.grid(row=1, column=0, sticky=W+E)
subidenti = LabelFrame(subident, text="Identification", padx=margen, pady=margen, font=("Times",tsubtitle))
subidenti.grid(row=0, column=0, columnspan=2, sticky=W+E)
subidentiid = LabelFrame(subidenti, text="Id", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subidentiid.grid(row=0, column=0)
subidentiidtype = LabelFrame(subidenti, text="IdType", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subidentiidtype.grid(row=0, column=1)
subidentiidvalue = Label(subidentiid, text="Id", padx=margen, pady=margen)
subidentiidvalue.grid(row=0, column=0)
subidentiidtypevalue = Label(subidentiidtype, text="IdType", padx=margen, pady=margen)
subidentiidtypevalue.grid(row=0, column=1)

serial = LabelFrame(subident, text= "Número Serial" , padx=margen, pady=margen, font=("Times",tsubtitle))
serial.grid(row=1, column=0)
construccion = LabelFrame(subident, text="Año de Construcción", padx=margen, pady=margen, font=("Times",tsubtitle))
construccion.grid(row=1, column=1)
denominacion = LabelFrame(subident, text="Denominación del Producto", padx=margen, pady=margen, font=("Times",tsubtitle))
denominacion.grid(row=2, column=0)
fabricante = LabelFrame(subident, text="Nombre del Fabricante", padx=margen, pady=margen, font=("Times",tsubtitle))
fabricante.grid(row=2, column=1)

serialvalue = Label(serial, text= "0" , padx=margen, pady=margen)
serialvalue.grid(row=0, column=0)
construccionvalue = Label(construccion , text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
construccionvalue.grid(row=0, column=1)
denominacionvalue = Label(denominacion, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
denominacionvalue.grid(row=1, column=0)
fabricantevalue = Label(fabricante, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
fabricantevalue.grid(row=1, column=1)



## --- Submodel Documentation

subdoc = LabelFrame(root, text= 'Submodelo Documentación' , padx=margen, pady=margen, font=("Times",ttitle))
subdoc.grid(row=1, column=1, sticky=W+E)

subdoci = LabelFrame(subdoc, text="Identification", padx=margen, pady=margen, font=("Times",tsubtitle))
subdoci.grid(row=0, column=0)
subdociid = LabelFrame(subdoci, text="Id", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subdociid.grid(row=0, column=0)
subdociidtype = LabelFrame(subdoci, text="IdType", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subdociidtype.grid(row=0, column=1)
subdociidvalue = Label(subdociid, text="Id", padx=margen, pady=margen)
subdociidvalue.grid(row=0, column=0)
subdociidtypevalue = Label(subdociidtype, text="IdType", padx=margen, pady=margen)
subdociidtypevalue.grid(row=0, column=1)

docop = LabelFrame(subdoc, text= "Documentos Operacionales" , padx=margen, pady=margen, font=("Times",tsubtitle))
docop.grid(row=0, column=1)

manualop = LabelFrame(docop, text= "Manual Operacional" , padx=margen, pady=margen, font=("Times",tsubsubtitle))
manualop.grid(row=0, column=0)

manualopruta = LabelFrame(manualop, text= "Ruta" , padx=margen, pady=margen, font=("Times",tsubsubtitle))
manualopruta.grid(row=0, column=0)

manualoprutavalue = Label(manualopruta, text= "0" , padx=margen, pady=margen)
manualoprutavalue.grid(row=0, column=0)



# --- Submodel Informacion Operacional

subinfop = LabelFrame(root, text= 'Submodelo Información Operacional' , padx=margen, pady=margen, font=("Times",ttitle))
subinfop.grid(row=2, column=0, sticky=W+E)
subinfopi = LabelFrame(subinfop, text="Identification", padx=margen, pady=margen, font=("Times",tsubtitle))
subinfopi.grid(row=0, column=0, sticky = W+E)
subinfopiid = LabelFrame(subinfopi, text="Id", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subinfopiid.grid(row=0, column=0)
subinfopiidtype = LabelFrame(subinfopi, text="IdType", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subinfopiidtype.grid(row=0, column=1)
subinfopiidvalue = Label(subinfopiid, text="Id", padx=margen, pady=margen)
subinfopiidvalue.grid(row=0, column=0)
subinfopiidtypevalue = Label(subinfopiidtype, text="IdType", padx=margen, pady=margen)
subinfopiidtypevalue.grid(row=0, column=1)

subinfoptm = LabelFrame(subinfop, text="Temperatura Motor", padx=margen, pady=margen, font=("Times",tsubtitle))
subinfoptm.grid(row=0, column=1, sticky = W+E)
subinfoptmv = LabelFrame(subinfoptm, text="Valor", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subinfoptmv.grid(row=0, column=0)
subinfoptmdef = LabelFrame(subinfoptm, text="Definición", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subinfoptmdef.grid(row=0, column=1)
subinfoptmvvalue = Label(subinfoptmv, text= "0" , padx=margen, pady=margen)
subinfoptmvvalue.grid(row=0, column=0)
subinfoptmdefvalue = Label(subinfoptmdef, text="Temperatura del\n motor principal de la impresora\n en grados centígrados (°C)", padx=margen, pady=margen).grid(row=0, column=1)

subinfoptb = LabelFrame(subinfop, text="Temperatura Base", padx=margen, pady=margen, font=("Times",tsubtitle))
subinfoptb.grid(row=1, column=0, sticky = W+E)
subinfoptbv = LabelFrame(subinfoptb, text="Valor", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subinfoptbv.grid(row=0, column=0)
subinfoptbdef = LabelFrame(subinfoptb, text="Definición", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subinfoptbdef.grid(row=0, column=1)
subinfoptbvvalue = Label(subinfoptbv, text= "0", padx=margen, pady=margen)
subinfoptbvvalue.grid(row=0, column=0)
subinfoptbdefvalue = Label(subinfoptbdef, text="Temperatura de la\n base de la impresora \n en grados centígrados (°C)", padx=margen, pady=margen).grid(row=0, column=1)

subinfopte = LabelFrame(subinfop, text="Temperatura Motor Extrusor", padx=margen, pady=margen, font=("Times",tsubtitle))
subinfopte.grid(row=1, column=1)
subinfoptev = LabelFrame(subinfopte, text="Valor", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subinfoptev.grid(row=0, column=0)
subinfoptedef = LabelFrame(subinfopte, text="Definición", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subinfoptedef.grid(row=0, column=1)
subinfoptevvalue = Label(subinfoptev, text= "0", padx=margen, pady=margen)
subinfoptevvalue.grid(row=0, column=0)
subinfoptedefvalue = Label(subinfoptedef, text="Temperatura del\n motor de extrusión\n en grados centígrados (°C)", padx=margen, pady=margen).grid(row=0, column=1)

def updatesubinfopfun(te, tm, tb):
    subinfoptevvalue["text"]=te
    subinfoptmvvalue["text"]=tm
    subinfoptbvvalue["text"]=tb
    

# --- Submoelo Información de Contacto

subinfcontact = LabelFrame(root, text= 'Submodelo Información de Contacto' , padx=margen, pady=margen, font=("Times",ttitle))
subinfcontact.grid(row=2, column=1, sticky=W+E)
subinfcontacti = LabelFrame(subinfcontact, text="Identification", padx=margen, pady=margen, font=("Times",tsubtitle))
subinfcontacti.grid(row=0, column=0)
subinfcontactiid = LabelFrame(subinfcontacti, text="Id", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subinfcontactiid.grid(row=0, column=0)
subinfcontactiidtype = LabelFrame(subinfcontacti, text="IdType", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subinfcontactiidtype.grid(row=0, column=1)
subinfcontactiidvalue = Label(subinfcontactiid, text="Id", padx=margen, pady=margen)
subinfcontactiidvalue.grid(row=0, column=0)
subinfcontactiidtypevalue = Label(subinfcontactiidtype, text="IdType", padx=margen, pady=margen)
subinfcontactiidtypevalue.grid(row=0, column=1)

proveedor1= [
    "PrimerNombre",
    "SegundoNombre",
    "Apellido",
    "CargoDeLaPersonaDeContacto",
    "Compañia",
    "Departamento",
    "DepartamentoGeografico",
    "Cuidad",
    "Direccion",
    "CodigoPostal",
    "CodigoNacional",
    "Idioma",
    "CorreoElectronico",
    "SitioWeb"

]

clickedproveedor= StringVar()
clickedproveedor.set(proveedor1[0])

proveedor = LabelFrame(subinfcontact, text= 'Informacion Proveedor' , padx=margen, pady=margen, font=("Times",tsubtitle))
proveedor.grid(row=1, column=0)


informacionproveedor = OptionMenu(proveedor, clickedproveedor, *proveedor1)
informacionproveedor.grid(row=0, column=0)


informacionproveedorvalue = Label(proveedor, text ="0", padx=margen, pady=margen, relief=SUNKEN)
informacionproveedorvalue.grid(row=0, column=1, columnspan=2, sticky=W+E)



# --- Submodelo Datos Tecnicos

subtechdata = LabelFrame(root, text= 'Submodelo Datos Técnicos', padx=margen, pady=margen, font=("Times",ttitle), labelanchor="n")
subtechdata.grid(row=3, column=0, sticky=W+E, columnspan=2)

subtechdatai = LabelFrame(subtechdata, text="Identification", padx=margen, pady=margen, font=("Times",tsubtitle))
subtechdatai.grid(row=0, column=0)
subtechdataiid = LabelFrame(subtechdatai, text="Id", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subtechdataiid.grid(row=0, column=0)
subtechdataiidtype = LabelFrame(subtechdatai, text="IdType", padx=margen, pady=margen, font=("Times",tsubsubtitle))
subtechdataiidtype.grid(row=0, column=1)
subtechdataiidvalue = Label(subtechdataiid, text="Id", padx=margen, pady=margen)
subtechdataiidvalue.grid(row=0, column=0)
subtechdataiidtypevalue = Label(subtechdataiidtype, text="IdType", padx=margen, pady=margen)
subtechdataiidtypevalue.grid(row=0, column=1)

dim = LabelFrame(subtechdata, text="Propiedades Dimensionales", padx=margen, pady=margen, font=("Times",tsubtitle))
dim.grid(row=0, column=1)
altura = LabelFrame(dim, text="Altura Impresora", padx=margen, pady=margen, font=("Times",tsubsubtitle))
altura.grid(row=0, column=0)
ancho = LabelFrame(dim, text="Ancho Impresora", padx=margen, pady=margen, font=("Times",tsubsubtitle))
ancho.grid(row=0, column=1)
dimcama = LabelFrame(dim, text="Dimensiones Cama", padx=margen, pady=margen, font=("Times",tsubsubtitle))
dimcama.grid(row=1, column=0)
peso = LabelFrame(dim, text="Peso Impresora", padx=margen, pady=margen, font=("Times",tsubsubtitle))
peso.grid(row=1, column=1)

alturavalue = Label(altura, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
alturavalue.grid(row=0, column=0)
anchovalue = Label(ancho, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
anchovalue.grid(row=0, column=0)
dimcamavalue = Label(dimcama, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
dimcamavalue.grid(row=0, column=0)
pesovalue = Label(peso, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
pesovalue.grid(row=0, column=0)

elec = LabelFrame(subtechdata, text="Propiedades Eléctricas", padx=margen, pady=margen, font=("Times",tsubtitle))
elec.grid(row=0, column=2)
voltaje = LabelFrame(elec, text="Voltaje", padx=margen, pady=margen, font=("Times",tsubsubtitle))
voltaje.grid(row=0, column=0)
corriente = LabelFrame(elec, text="Corriente", padx=margen, pady=margen, font=("Times",tsubsubtitle))
corriente.grid(row=0, column=1)
potencia = LabelFrame(elec, text="Potencia", padx=margen, pady=margen, font=("Times",tsubsubtitle))
potencia.grid(row=1, column=0)
frecuencia = LabelFrame(elec, text="Frecuencia", padx=margen, pady=margen, font=("Times",tsubsubtitle))
frecuencia.grid(row=1, column=1)
tipoalimentacion = LabelFrame(elec, text="Tipo Alimentacion", padx=margen, pady=margen, font=("Times",tsubsubtitle))
tipoalimentacion.grid(row=0, column=2)
tipocon = LabelFrame(elec, text="Tipo Conector", padx=margen, pady=margen, font=("Times",tsubsubtitle))
tipocon.grid(row=1, column=2)

voltajevalue = Label(voltaje, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
voltajevalue.grid(row=0, column=0)
corrientevalue = Label(corriente, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
corrientevalue.grid(row=0, column=0)
potenciavalue = Label(potencia, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
potenciavalue.grid(row=0, column=0)
frecuenciavalue = Label(frecuencia, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
frecuenciavalue.grid(row=0, column=0)
tipoalimentacionvalue = Label(tipoalimentacion, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
tipoalimentacionvalue.grid(row=0, column=0)
tipoconvalue = Label(tipocon, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
tipoconvalue.grid(row=0, column=0)

op = LabelFrame(subtechdata, text="Propiedades Operativas", padx=margen, pady=margen, font=("Times",tsubtitle))
op.grid(row=0, column=3)
materiales = LabelFrame(op, text="Materiales de Impresion", padx=margen, pady=margen, font=("Times",tsubsubtitle))
materiales.grid(row=0, column=0)
tempmaxcama = LabelFrame(op, text="Temperatura Máxima Cama", padx=margen, pady=margen, font=("Times",tsubsubtitle))
tempmaxcama.grid(row=0, column=1)
tempmaxboq = LabelFrame(op, text="Temperatura Máxima Boquilla", padx=margen, pady=margen, font=("Times",tsubsubtitle))
tempmaxboq.grid(row=1, column=0)
velmaximp = LabelFrame(op, text="Velocidad Máxima Impresión", padx=margen, pady=margen, font=("Times",tsubsubtitle))
velmaximp.grid(row=1, column=1)

materialesvalue= Label(materiales, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
materialesvalue.grid(row=0, column=0)
tempmaxcamavalue= Label(tempmaxcama, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
tempmaxcamavalue.grid(row=0, column=0)
tempmaxboqvalue= Label(tempmaxboq, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
tempmaxboqvalue.grid(row=0, column=0)
velmaximpvalue= Label(velmaximp, text="0", padx=margen, pady=margen, font=("Times",tsubsubtitle))
velmaximpvalue.grid(row=0, column=0)








    
    
class SubscriptionHandler:
    """
    The SubscriptionHandler is used to handle the data that is received for the subscription.
    """
    def datachange_notification(self, node: Node, val, data):
        """
        Callback for asyncua Subscription.
        This method will be called when the Client received a data change message from the Server.
        """
        ##_logger.info('datachange_notification %r %s', node, val)


async def main():
    global assetkind
    global ttitle
    global tsubtitle
    global tsubsubtitle
    global clickedproveedor
    global proveedor1
    #t1= threading.Thread(target=start_frame).start()
    
    
    url = 'opc.tcp://DESKTOP-VEK9VUM:4334/UA/MainServerAAS'
    # url = 'opc.tcp://commsvr.com:51234/UA/CAS_UA_Server'
    async with Client(url=url) as client:
        while True:
            #root.geometry("1100x800")
           
            

            
            # Client has a few methods to get proxy to UA nodes that should always be in address space such as Root or Objects
            # Node objects have methods to read and write node attributes as well as browse or populate address space
            #_logger.info('Children of root are: %r', await client.nodes.root.get_children())

            #uri = 'http://examples.freeopcua.github.io'
            #idx = await client.get_namespace_index(uri)
            # get a specific node knowing its node id
            #var = client.get_node(ua.NodeId(1002, 2))
            #var = client.get_node("ns=1;i=1010")

            ## --- VARIABLES SENSORES
            tevar = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloInformacionOperacional", "1:TemperaturaMotorExtrusor"])
            tbvar = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloInformacionOperacional", "1:TemperaturaBase"])
            tmvar = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloInformacionOperacional", "1:TemperaturaMotor"])
        
            #print("Aqui está la variable del nodo", var, await var.read_value())
            te=str(await tevar.read_value())
            tb=str(await tbvar.read_value())
            tm=str(await tmvar.read_value())

            updatesubinfopfun(te, tm, tb)

            ## --- AAS

            aasid = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:Identification", "2:Id"])
            aasidtype = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:Identification", "2:IdType"])
            aasversion = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:Administration", "2:Version"])
            aasrevision = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:Administration", "2:Revision"])
            aasiidvalue["text"]= str(await aasid.read_value())
            aasiidtypevalue["text"] = str(await aasidtype.read_value())
            aasadversionvalue["text"] = str(await aasversion.read_value())
            aasadrevisionvalue["text"] = str(await aasrevision.read_value())

            ## --- ASSET

            assetid = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "2:Asset", "1:Identification", "2:Id"])
            assetidtype = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "2:Asset", "1:Identification", "2:IdType"])
            assetkeys = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "2:Asset", "1:AssetIdentificationModel", "2:Keys"])
            assetiidvalue["text"]= str(await assetid.read_value())
            assetiidtypevalue["text"] = str(await assetidtype.read_value())
            assetimkeysvalue["text"] = str(await assetkeys.read_value())

            ## --- SUBMODEL IDENTIFICATION

            subidentid = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloIdentificacion", "1:Identification", "2:Id"])
            subidentidtype = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloIdentificacion", "1:Identification", "2:IdType"])
            subidentiidvalue["text"] = str(await subidentid.read_value())
            subidentiidtypevalue["text"] = str(await subidentidtype.read_value())

            ## --- SUBMODEL DOCUMENTATION
            subdocid = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloDocumentacion", "1:Identification", "2:Id"])
            subdocidtype = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloDocumentacion", "1:Identification", "2:IdType"])
            subdociidvalue["text"] = str(await subdocid.read_value())
            subdociidtypevalue["text"] = str(await subdocidtype.read_value())

            ## --- SUBMODEL INFORMACION OPERACIONAL

            subinfopid = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloInformacionOperacional", "1:Identification", "2:Id"])
            subinfopidtype = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloInformacionOperacional", "1:Identification", "2:IdType"])
            subinfopiidvalue["text"] = str(await subinfopid.read_value())
            subinfopiidtypevalue["text"] = str(await subinfopidtype.read_value())
           

            ## --- SUBMODEL INFORMACION DE CONTACTO

            subinfcontactid = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloInformacionDeContacto", "1:Identification", "2:Id"])
            subinfcontactidtype = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloInformacionDeContacto", "1:Identification", "2:IdType"])
            subinfcontactiidvalue["text"] = str(await subinfopid.read_value())
            subinfcontactiidtypevalue["text"] = str(await subinfcontactidtype.read_value())

            ## --- SUBMODEL DATOS TECNICOS

            subtechdataid = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloDatosTecnicos", "1:Identification", "2:Id"])
            subtechdataidtype = await client.nodes.root.get_child(["0:Objects", "1:AASROOT", "1:Impresora3DPRUSA", "1:SubmodeloDatosTecnicos", "1:Identification", "2:IdType"])
            subtechdataiidvalue["text"] = str(await subtechdataid.read_value())
            subtechdataiidtypevalue["text"] = str(await subtechdataidtype.read_value())

            subopaltura = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesDimensionales', '1:AlturaImpresora', '2:Value'])
            subopancho = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesDimensionales', '1:AnchoImpresora', '2:Value'])
            subopdimcama = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesDimensionales', '1:DimensionesCama', '2:Value'])
            suboppeso = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesDimensionales', '1:PesoImpresora', '2:Value'])
            alturavalue["text"] = str(await subopaltura.read_value())
            anchovalue["text"] = str(await subopancho.read_value())
            dimcamavalue["text"] = str(await subopdimcama.read_value())
            pesovalue["text"] = str(await suboppeso.read_value())

            subelecvoltaje = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesElectricas', '1:Voltaje', '2:Value'])
            subeleccorriente  = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesElectricas', '1:Corriente', '2:Value'])
            subelecpotencia  = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesElectricas', '1:Potencia', '2:Value'])
            subelecfrecuencia = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesElectricas', '1:Frecuencia', '2:Value'])
            subelectipoalimentacion = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesElectricas', '1:TipoAlimentacion', '2:Value'])
            subelectipocon = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesElectricas', '1:TipoConectorEntrada', '2:Value'])
            
            voltajevalue["text"] =  str(await subelecvoltaje.read_value())
            corrientevalue["text"] =  str(await subeleccorriente.read_value())
            potenciavalue["text"] =  str(await subelecpotencia .read_value())
            frecuenciavalue["text"] =  str(await subelecfrecuencia.read_value())
            tipoalimentacionvalue["text"] =  str(await subelectipoalimentacion.read_value())
            tipoconvalue["text"] =  str(await subelectipocon.read_value())

            subopmateriales = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesOperativas', '1:MaterialesImpresion', '2:Value'])
            suboptempmaxcama = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesOperativas', '1:TemperaturaMaxCama', '2:Value'])
            suboptempmaxboq = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesOperativas', '1:TemperaturaMaxBoquilla', '2:Value'])
            subopvelmaximp = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloDatosTecnicos', '1:PropiedadesTecnicas', '1:PropiedadesOperativas', '1:VelocidadMaxImpresion', '2:Value'])

            materialesvalue['text'] =  str(await subopmateriales.read_value())
            tempmaxcamavalue['text'] =  str(await suboptempmaxcama.read_value())
            tempmaxboqvalue['text'] =  str(await suboptempmaxboq.read_value())
            velmaximpvalue['text'] =  str(await subopvelmaximp.read_value())

            ## --- SUBMODEL DOCUMENTATION


            ## --- SUBMODEL INFORMACION DE CONTACTO

            case = str(clickedproveedor.get())
            if (case != "CorreoElectronico" and case != "NumeroTelefonico"):
                varinfoporveedor = await client.nodes.root.get_child(['0:Objects', '1:AASROOT', '1:Impresora3DPRUSA', '1:SubmodeloInformacionDeContacto', '1:Proveedor1', '1:'+str(case)+'1', '2:Value'])
                informacionproveedorvalue["text"]=str(await varinfoporveedor.read_value())


            
            




            


 







            



            
            
##            handler = SubscriptionHandler()
##            # We create a Client Subscription.
##            subscription = await client.create_subscription(1000, handler)
##            nodes = [
##                var,
##                client.get_node(ua.ObjectIds.Server_ServerStatus_CurrentTime),
##            ]
##            # We subscribe to data changes for two nodes (variables).
##            await subscription.subscribe_data_change(nodes)
            #var = await client.nodes.root.get_child(["0:Objects", f"{idx}:MyObject", f"{idx}:MyVariable"])
            #print("My variable", var, await var.read_value())
            # print(var)
            # await var.read_data_value() # get value of node as a DataValue object
            # await var.read_value() # get value of node as a python builtin
            # await var.write_value(ua.Variant([23], ua.VariantType.Int64)) #set node value using explicit data type
            # await var.write_value(3.9) # set node value using implicit data type
            
            

def start():
    if __name__ == '__main__':
        asyncio.run(main())

t1= threading.Thread(target=start).start()


root.mainloop()
