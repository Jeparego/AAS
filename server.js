/*global require,setInterval,console */
const opcua = require("node-opcua");
const {DataType,nodesets,StatusCodes,Variant,standardUnits} = require("node-opcua");
const path = require("path");
const SerialPort = require('serialport');
const I4AAS = "Opc.Ua.I4AAS.NodeSet2.xml";
var Te= 0;
var Tb= 0;
var Tm= 0;
//Create an instance of OPCUAServer
const server = new opcua.OPCUAServer({
    nodeset_filename:[
        I4AAS,
        opcua.nodesets.standard
    ],
    port: 4334, // the port of the listening socket of the server
    resourcePath: "/UA/MainServerAAS", // this path will be added to the endpoint resource name
     buildInfo : {
        productName: "MySServerAAS",
        buildNumber: "7658",
        buildDate: new Date(2022,8,2)
    },
    
});

function post_initialize() {
    console.log("initialized");
    function construct_my_address_space(server) {
    
        const addressSpace = server.engine.addressSpace;
        const namespace = addressSpace.getOwnNamespace();
        const nsAAS = addressSpace.getNamespaceIndex("http://opcfoundation.org/UA/I4AAS/");  
        // declare a new object
        //ObjectTypesI4AA
        const AASReferenceType = addressSpace.findObjectType("AASReferenceType",nsAAS);
        const AASSubmodelType = addressSpace.findObjectType("AASSubmodelType",nsAAS);
        const AASAssetType = addressSpace.findObjectType("AASAssetType",nsAAS);
        const AASSubmodelElementType = addressSpace.findObjectType("AASSubmodelElementType",nsAAS);
        const AASConceptDictionaryType = addressSpace.findObjectType("AASConceptDictionaryType",nsAAS);
        const IAASIdentifiableType = addressSpace.findObjectType("IAASIdentifiableType",nsAAS);
        const AASIdentifierType = addressSpace.findObjectType("AASIdentifierType",nsAAS);
        const AASMultiLanguagePropertyType = addressSpace.findObjectType("AASMultiLanguagePropertyType",nsAAS);
        const AASPropertyType = addressSpace.findObjectType("AASPropertyType",nsAAS);
        const AASIrdiConceptDescriptionType = addressSpace.findObjectType('AASIrdiConceptDescriptionType',nsAAS);
        const AASIriConceptDescriptionType = addressSpace.findObjectType('AASIriConceptDescriptionType', nsAAS)
        const AASDataSpecificationIEC61360Type = addressSpace.findObjectType('AASDataSpecificationIEC61360Type',nsAAS);
        const AASAdministrativeInformationType = addressSpace.findObjectType('AASAdministrativeInformationType',nsAAS);
        const AASFiletype = addressSpace.findObjectType('AASFileType',nsAAS);
        const FileType = addressSpace.findObjectType("FileType", 0);
        const AASSubmodelElementCollectionType = addressSpace.findObjectType('AASSubmodelElementCollectionType',nsAAS);
        const AASAssetAdministrationShellType = addressSpace.findObjectType("AASAssetAdministrationShellType",nsAAS);
        // --- MODELAMIENTO ---------------------------------------------------------------------------------------------------------------------
        const AASROOT = namespace.addFolder(addressSpace.rootFolder.objects,{browseName: "AASROOT"});
        // --- AAS -------------------------------------------------------------------------------------------------------------------------
        // --- INSTANCIAMIENTO-------------------------------------------
        const AAS = AASAssetAdministrationShellType.instantiate({
            browseName: "Impresora3DPRUSA",
            organizedBy: AASROOT,
            optionals:["DerivedFrom"]
        });
        const AAS_Id= AASIdentifierType.instantiate({
            browseName: "Identification",
            componentOf: AAS
        });
        const administration = AASAdministrativeInformationType.instantiate({
            browseName: "Administration",
            componentOf: AAS,
            optionals: ["Version","Revision"]
        });
        AAS.addReference({referenceType: "HasInterface", nodeId: IAASIdentifiableType});
        // --- MAPEO --------------------------------------------------------------
        AAS_Id.id.setValueFromSource({dataType: DataType.String, value: "https://www.javerianacali.edu.co/cap/aas/1/1/AAS_3DPrinter"});
        AAS_Id.idType.setValueFromSource({dataType: DataType.Int32, value:1});
        administration.version.setValueFromSource({dataType: DataType.String, value: "1"});
        administration.revision.setValueFromSource({dataType: DataType.String, value: "100"});
        // --- ASSET ---------------------------------------------------------------------------------------------------------------------------------
        // --- INSTANCIAMIENTO ---------------------------------------
        const AssetId = AASIdentifierType.instantiate({
            browseName: "Identification",
            componentOf: AAS.asset
        });
        const AssetIdentificationModel = AASReferenceType.instantiate({
            browseName: "AssetIdentificationModel",
            componentOf: AAS.asset
        });
        // --- MAPEO -------------------------------------------------
        AAS.asset.addReference({referenceType: "HasInterface", nodeId: IAASIdentifiableType});
        AssetId.id.setValueFromSource({dataType: "String", value: "https://impresoras3dcolombia.co/IP3DPRUSA"});
        AssetId.idType.setValueFromSource({dataType: "Int32", value:1});
        AAS.asset.assetKind.setValueFromSource({dataType: "Int32", value:1});   
        AssetIdentificationModel.keys.setValueFromSource({dataType: "String", value: "(Submodel)[IRI]https://impresoras3dcolombia.co/IP3DPRUSA"});
       
       
        // --- CONCEPT DICTIONARY ---------------------------------------------------------------------------------------------------------------------
        
        // --- INSTANCIAMIENTO ------------------------------------------------------
        const AASConceptDictionary = AASConceptDictionaryType.instantiate({
            browseName: "ConceptDictionary",
            componentOf: AAS,
        });
        const ManufacturerNameSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO677#002",
            componentOf: AASConceptDictionary
        });
        const ManufacturerProductDesignationSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAW338#001",
            componentOf: AASConceptDictionary
        });
        const SerialNumberSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAM556#002",
            componentOf: AASConceptDictionary
        });
        const YearOfConstructionSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAP906#001",
            componentOf: AASConceptDictionary
        });
        const ContactInformationSubmodelTemplate = AASIriConceptDescriptionType.instantiate({
            browseName: "https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/ContactInformation",
            componentOf: AASConceptDictionary
        });
        const Role_Of_Contact_PersonSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO204#003",
            componentOf: AASConceptDictionary
        });
        const NationalCodeSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO134#002",
            componentOf: AASConceptDictionary
        });
        const LanguageSemantic = AASIriConceptDescriptionType.instantiate({
            browseName: "https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/ContactInformation/Language",
            componentOf: AASConceptDictionary
        });
        const City_TownSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO132#002",
            componentOf: AASConceptDictionary
        });
        const CompanySemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAP906#001",
            componentOf: AASConceptDictionary
        });
        const DepartamentSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO127#003",
            componentOf: AASConceptDictionary
        });
        const PhoneSemantic = AASIriConceptDescriptionType.instantiate({
            browseName: "https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/ContactInformation/Phone",
            componentOf: AASConceptDictionary
        });
        const Telephone_NumberSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO136#002",
            componentOf: AASConceptDictionary
        });
        const Aviable_Time_PhoneSemantic = AASIriConceptDescriptionType.instantiate({
            browseName: "https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/ContactInformation/AvailableTime/",
            componentOf: AASConceptDictionary
        });
        const Type_Of_TelephoneSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO137#003",
            componentOf: AASConceptDictionary
        });
        const EmailSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: " 0173-1#02-AAQ836#005",
            componentOf: AASConceptDictionary
        });
        const Email_AdressSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO198#002",
            componentOf: AASConceptDictionary
        });
        const Type_Of_AddressSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO199#003",
            componentOf: AASConceptDictionary
        });
        const StreetSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO128#002",
            componentOf: AASConceptDictionary
        });
        const Zip_CodeSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO129#002",
            componentOf: AASConceptDictionary
        });
        const State_CountrySemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO133#002",
            componentOf: AASConceptDictionary
        });
        const SurnameSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO205#002",
            componentOf: AASConceptDictionary
        });
        const NameSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO206#002",
            componentOf: AASConceptDictionary
        });
        const Middle_NameSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAO207#002",
            componentOf: AASConceptDictionary
        });
        const Adress_Of_Additional_LinkSemantic = AASIrdiConceptDescriptionType.instantiate({
            browseName: "0173-1#02-AAQ326#002",
            componentOf: AASConceptDictionary
        });


        
        
        

       

        // --- SUBMODELO DE IDENTIFICACION O NAMEPLATE------------------------------------------------------------------------------------------------------------------------
        
        // --- INSTANCIAMIENTO -------------------------------------------------
       
        const SM_Identification = AASSubmodelType.instantiate({
            browseName: "SubmodeloIdentificacion",
            componentOf: AAS
        }); 
        const SM_Identification_Id= AASIdentifierType.instantiate({
            browseName: "Identification",
            componentOf: SM_Identification
        });
        // Componentes del submodelo
        const ManufacturerName = AASMultiLanguagePropertyType.instantiate({
            browseName:"NombreDelFabricante",
            componentOf:SM_Identification,
            optionals: ["Value", "ValueId"]

        });
        const ManufacturerProductDesignation = AASMultiLanguagePropertyType.instantiate({
            browseName:"DenominacionDelProducto",
            componentOf:SM_Identification,
            optionals: ["Value", "ValueId"]
        });
        // const Address = AASSubmodelElementCollectionType.instantiate({
        //     browseName: "Address",
        //     componentOf: SM_Identification,
        //     optionals: ["AllowDuplicates"]
        // });
        // const ManufacturerProductFamily = AASMultiLanguagePropertyType.instantiate({
        //     browseName:"ManufacturerProductFamily",
        //     componentOf:SM_Identification,
        //     optionals: ["Value", "ValueId"]
        // });
        const SerialNumber = AASPropertyType.instantiate({
            browseName:"NumeroSerial",
            componentOf:SM_Identification,
            optionals: ["Value", "ValueId"]
        });
        const YearOfConstruction = AASPropertyType.instantiate({
            browseName:"AñoDeConstruccion",
            componentOf:SM_Identification, 
            optionals: ["Value", "ValueId"]
        });
        // const Markings = AASSubmodelElementCollectionType.instantiate({
        //     browseName: "Markings",
        //     componentOf: SM_Identification,
        //     optionals: ["AllowDuplicates"]
        // });
        // const AssetSpecificProperties = AASSubmodelElementCollectionType.instantiate({
        //     browseName: "AssetSpecificProperties",
        //     componentOf: SM_Identification,
        //     optionals: ["AllowDuplicates"]
        // });


       
        

        // --- MAPEO ------------------------------------------------------
        //Valores
        SM_Identification_Id.id.setValueFromSource({dataType: DataType.String, value: "https:/www.javerianacali.edu.co/cap/Identification3DPRUSA/1/1"});
        SM_Identification_Id.idType.setValueFromSource({dataType: DataType.Int32, value: 1});
        SerialNumber.value.setValueFromSource({dataType: DataType.String, value: "AFDS67866"});
        SerialNumber.valueType.setValueFromSource({dataType: DataType.Int32, value:11});
        ManufacturerName.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: " IP3D"}]});
        ManufacturerProductDesignation.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "Impresora 3D PRUSA ubicada en el CAP"}]});
        YearOfConstruction.value.setValueFromSource({dataType: DataType.String, value: "2017"});
        YearOfConstruction.valueType.setValueFromSource({dataType: DataType.Int32, value:11});

        //Referencias
        SM_Identification.addReference({referenceType: "HasInterface", nodeId: IAASIdentifiableType});
        ManufacturerName.addReference({referenceType:"HasDictionaryEntry", nodeId: ManufacturerNameSemantic});
        ManufacturerProductDesignation.addReference({referenceType:"HasDictionaryEntry", nodeId: ManufacturerProductDesignationSemantic});
        SerialNumber.addReference({referenceType:"HasDictionaryEntry", nodeId: SerialNumberSemantic});
        YearOfConstruction.addReference({referenceType: "HasDictionaryEntry", nodeId: YearOfConstructionSemantic});
        
        // --- SUBMODELO DE INFORMACION DE CONTACTO DE PROVEEDORES -----------------------------------------------------------------
        const SM_Contact_Information = AASSubmodelType.instantiate({
            browseName: "SubmodeloInformacionDeContacto",
            componentOf: AAS
        }); 
        const SM_Contact_Information_Id= AASIdentifierType.instantiate({
            browseName: "Identification",
            componentOf: SM_Contact_Information
        });
        const Contact_Information_1 = AASSubmodelElementCollectionType.instantiate({
            browseName: "Proveedor1",
            componentOf: SM_Contact_Information,
            optionals: ["AllowDuplicates"]
        });
        const Role_Of_Contact_Person_1 = AASPropertyType.instantiate({
            browseName:"CargoDeLaPersonaDeContacto1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        const NationalCode_1 = AASMultiLanguagePropertyType.instantiate({
            browseName:"CodigoNacional1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        const Language_1 = AASPropertyType.instantiate({
            browseName:"Idioma1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        const City_Town_1 = AASMultiLanguagePropertyType.instantiate({
            browseName:"Cuidad1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        const Company_1 = AASMultiLanguagePropertyType.instantiate({
            browseName:"Compañia1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        const Departament_1 = AASMultiLanguagePropertyType.instantiate({
            browseName:"Departamento1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        const Phone_1 = AASSubmodelElementCollectionType.instantiate({
            browseName: "NumeroTelefonico1",
            componentOf: Contact_Information_1,
            optionals: ["AllowDuplicates"]
        });
        
            const Telephone_Number_1 = AASMultiLanguagePropertyType.instantiate({
                browseName:"Numero1",
                componentOf: Phone_1,
                optionals: ["Value", "ValueId"]
            });
            const Aviable_Time_Phone_1 = AASMultiLanguagePropertyType.instantiate({
                browseName:"Disponibilidad1",
                componentOf:Phone_1,
                optionals: ["Value", "ValueId"]
            });
            const Type_Of_Telephone_1 = AASPropertyType.instantiate({
                browseName:"TipoDeTelefono1",
                componentOf:Phone_1,
                optionals: ["Value", "ValueId"]
            });
            
        const Email_1 = AASSubmodelElementCollectionType.instantiate({
            browseName: "CorreoElectronico1",
            componentOf: Contact_Information_1,
            optionals: ["AllowDuplicates"]
        });
        
            const Email_Adress_1 = AASPropertyType.instantiate({
                browseName:"DireccionDeCorreo1",
                componentOf:Email_1,
                optionals: ["Value", "ValueId"]
            });
            const Type_Of_Address_1 = AASPropertyType.instantiate({
                browseName:"TipoDeCorreo1",
                componentOf:Email_1,
                optionals: ["Value", "ValueId"]
            });
            
        const Street_1 = AASMultiLanguagePropertyType.instantiate({
            browseName:"Direccion1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        const Zip_Code_1 = AASMultiLanguagePropertyType.instantiate({
            browseName:"CodigoPostal1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        const State_Country_1 = AASMultiLanguagePropertyType.instantiate({
            browseName:"DepartamentoGeografico1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        const Surname_1 = AASMultiLanguagePropertyType.instantiate({
            browseName:"Apellido1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        const Name_1 = AASMultiLanguagePropertyType.instantiate({
            browseName:"PrimerNombre1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        const Middle_Name_1 = AASMultiLanguagePropertyType.instantiate({
            browseName:"SegundoNombre1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        const Adress_Of_Additional_Link_1 = AASPropertyType.instantiate({
            browseName:"SitioWeb1",
            componentOf:Contact_Information_1,
            optionals: ["Value", "ValueId"]
        });
        
        // MAPEO

        // Valores
        SM_Contact_Information_Id.id.setValueFromSource({dataType: DataType.String, value: "https:/www.javerianacali.edu.co/cap/ContactI3DPRUSA/1/0"});
        SM_Contact_Information_Id.idType.setValueFromSource({dataType: DataType.Int32, value: 1});
        
        Role_Of_Contact_Person_1.value.setValueFromSource({dataType: DataType.String, value: "AAS928#001 (commercial contact)"});
        Role_Of_Contact_Person_1.valueType.setValueFromSource({dataType: DataType.Int32, value:11});
        
        NationalCode_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "Codigo Colombia"}]});
        
        Language_1.value.setValueFromSource({dataType: DataType.String, value: "Español"});
        Language_1.valueType.setValueFromSource({dataType: DataType.Int32, value:11});

        City_Town_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "Cali"}]});
        
        Company_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "RepuestosSA"}]});
        
        Departament_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "Repuestos"}]});
        
        Telephone_Number_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "+57 3168697886"}]});
       
        Aviable_Time_Phone_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "Lunes a Viernes - 8:00 AM a 6:00PM"}]});
        
        Type_Of_Telephone_1.value.setValueFromSource({dataType:DataType.String,value: "0173-1#07-AAS755#001 (office mobile)"});
        Type_Of_Telephone_1.valueType.setValueFromSource({dataType:DataType.Int32,value:11});
        
        Email_Adress_1.value.setValueFromSource({dataType: DataType.String, value: "proveedoresSA@gmail.com"});
        Email_Adress_1.valueType.setValueFromSource({dataType: DataType.Int32, value:11});

        Type_Of_Address_1.value.setValueFromSource({dataType: DataType.String, value: "0173-1#07-AAS754#001 (office)"});
        Type_Of_Address_1.valueType.setValueFromSource({dataType: DataType.Int32, value:11});

        Street_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "Carrera 17G # 25-38"}]});
        
        Zip_Code_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "10006"}]});
            
        State_Country_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "Valle del Cauca"}]});
            
        Surname_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "Rodrigo Jimenez"}]});
            
        Name_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "Juan"}]});
           
        Middle_Name_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "Alfonzo"}]});
            
        Adress_Of_Additional_Link_1.value.setValueFromSource({dataType:DataType.LocalizedText,value:[{locale: "es", text: "www.proveedoresSA.com"}]});


        // Referencias

        SM_Contact_Information.addReference({referenceType: "HasInterface", nodeId: IAASIdentifiableType});
        SM_Contact_Information.addReference({referenceType: "HasDictionaryEntry", nodeId: ContactInformationSubmodelTemplate});
        Role_Of_Contact_Person_1.addReference({referenceType:"HasDictionaryEntry", nodeId: Role_Of_Contact_PersonSemantic});
        NationalCode_1.addReference({referenceType:"HasDictionaryEntry", nodeId: NationalCodeSemantic});
        Language_1.addReference({referenceType:"HasDictionaryEntry", nodeId: LanguageSemantic});
        City_Town_1.addReference({referenceType: "HasDictionaryEntry", nodeId: City_TownSemantic});
        Company_1.addReference({referenceType: "HasDictionaryEntry", nodeId: CompanySemantic});
        Departament_1.addReference({referenceType: "HasDictionaryEntry", nodeId: DepartamentSemantic});
        Phone_1.addReference({referenceType: "HasDictionaryEntry", nodeId: PhoneSemantic});
        Telephone_Number_1.addReference({referenceType: "HasDictionaryEntry", nodeId: Telephone_NumberSemantic});
        Aviable_Time_Phone_1.addReference({referenceType: "HasDictionaryEntry", nodeId: Aviable_Time_PhoneSemantic});
        Type_Of_Telephone_1.addReference({referenceType: "HasDictionaryEntry", nodeId: Type_Of_TelephoneSemantic});
        Email_1.addReference({referenceType: "HasDictionaryEntry", nodeId: Type_Of_TelephoneSemantic});
        Email_Adress_1.addReference({referenceType: "HasDictionaryEntry", nodeId: EmailSemantic});
        Type_Of_Address_1.addReference({referenceType: "HasDictionaryEntry", nodeId: Type_Of_AddressSemantic});
        Street_1.addReference({referenceType: "HasDictionaryEntry", nodeId:  StreetSemantic});
        Zip_Code_1.addReference({referenceType: "HasDictionaryEntry", nodeId: Zip_CodeSemantic});
        State_Country_1.addReference({referenceType: "HasDictionaryEntry", nodeId: State_CountrySemantic});
        Surname_1.addReference({referenceType: "HasDictionaryEntry", nodeId:  SurnameSemantic});
        Name_1.addReference({referenceType: "HasDictionaryEntry", nodeId:  NameSemantic});
        Middle_Name_1.addReference({referenceType: "HasDictionaryEntry", nodeId: Middle_NameSemantic});
        Adress_Of_Additional_Link_1.addReference({referenceType: "HasDictionaryEntry", nodeId: Adress_Of_Additional_LinkSemantic});


       
        
        // --- SUBMODELO DE DATOS TÉCNICOS --------------------------------------------------------------------------

        const SM_Technical_Data = AASSubmodelType.instantiate({
            browseName: "SubmodeloDatosTecnicos",
            componentOf: AAS
        });
        const SM_Technical_Data_Id= AASIdentifierType.instantiate({
            browseName: "Identification",
            componentOf: SM_Technical_Data
        });
        const SM_Element_Technical_Propierties = AASSubmodelElementCollectionType.instantiate({
            browseName: "PropiedadesTecnicas",
            componentOf: SM_Technical_Data,
            optionals: ["AllowDuplicates"]
        });
        const SM_Element_Main_Section_Electrical = AASSubmodelElementCollectionType.instantiate({
            browseName: "PropiedadesElectricas",
            componentOf: SM_Element_Technical_Propierties,
            optionals: ["AllowDuplicates"]
        });
        const Voltage = AASPropertyType.instantiate({
            browseName:"Voltaje",
            componentOf:SM_Element_Main_Section_Electrical,
            optionals: ["Value"]
        });
        const Current = AASPropertyType.instantiate({
            browseName:"Corriente",
            componentOf:SM_Element_Main_Section_Electrical,
            optionals: ["Value"]
        });
        const Power = AASPropertyType.instantiate({
            browseName:"Potencia",
            componentOf:SM_Element_Main_Section_Electrical,
            optionals: ["Value"]
        });
        const Frequenz = AASPropertyType.instantiate({
            browseName:"Frecuencia",
            componentOf:SM_Element_Main_Section_Electrical,
            optionals: ["Value"]
        });
        const SignalType = AASPropertyType.instantiate({
            browseName:"TipoAlimentacion",
            componentOf:SM_Element_Main_Section_Electrical,
            optionals: ["Value"]
        });
        const Plug = AASPropertyType.instantiate({
            browseName:"TipoConectorEntrada",
            componentOf:SM_Element_Main_Section_Electrical,
            optionals: ["Value"]
        });
        

        const SM_Element_Main_Section_Dimensions = AASSubmodelElementCollectionType.instantiate({
            browseName: "PropiedadesDimensionales",
            componentOf: SM_Element_Technical_Propierties,
            optionals: ["AllowDuplicates"]
        });
        const BedDimensions = AASPropertyType.instantiate({
            browseName:"DimensionesCama",
            componentOf:SM_Element_Main_Section_Dimensions,
            optionals: ["Value"]
        });
        const Height = AASPropertyType.instantiate({
            browseName:"AlturaImpresora",
            componentOf:SM_Element_Main_Section_Dimensions,
            optionals: ["Value"]
        });
        const Width = AASPropertyType.instantiate({
            browseName:"AnchoImpresora",
            componentOf:SM_Element_Main_Section_Dimensions,
            optionals: ["Value"]
        });
        const Weight = AASPropertyType.instantiate({
            browseName:"PesoImpresora",
            componentOf:SM_Element_Main_Section_Dimensions,
            optionals: ["Value"]
        });

        const SM_Element_Main_Section_Capabilities = AASSubmodelElementCollectionType.instantiate({
            browseName: "PropiedadesOperativas",
            componentOf: SM_Element_Technical_Propierties,
            optionals: ["AllowDuplicates"]
        });

        const Materials = AASPropertyType.instantiate({
            browseName:"MaterialesImpresion",
            componentOf:SM_Element_Main_Section_Capabilities,
            optionals: ["Value"]
        });
        const MaxPrintVelocity = AASPropertyType.instantiate({
            browseName:"VelocidadMaxImpresion",
            componentOf:SM_Element_Main_Section_Capabilities,
            optionals: ["Value"]
        });
        const MaxTempBed = AASPropertyType.instantiate({
            browseName:"TemperaturaMaxCama",
            componentOf:SM_Element_Main_Section_Capabilities,
            optionals: ["Value"]
        });
        
        const MaxTempNozzle = AASPropertyType.instantiate({
            browseName:"TemperaturaMaxBoquilla",
            componentOf:SM_Element_Main_Section_Capabilities,
            optionals: ["Value"]
        });
        
       

       


        // ---------- MAPEO ---------------------

        // Valores
        SM_Technical_Data_Id.id.setValueFromSource({dataType: DataType.String, value: "https:/www.javerianacali.edu.co/cap/Tecnicos3DPRUSA/1/1"});
        SM_Technical_Data_Id.idType.setValueFromSource({dataType: DataType.Int32, value: 1});

        Voltage.value.setValueFromSource({dataType: DataType.Int32,value:110});
        Voltage.valueType.setValueFromSource({dataType:DataType.Int32,value:5});

        Current.value.setValueFromSource({dataType:DataType.Int32,value:4});
        Current.valueType.setValueFromSource({dataType:DataType.Int32,value:5});

        Power.value.setValueFromSource({dataType:DataType.Int32,value:440});
        Power.valueType.setValueFromSource({dataType:DataType.Int32,value:5});

        Plug.value.setValueFromSource({dataType: DataType.String, value: "PLUG C14"});
        Plug.valueType.setValueFromSource({dataType:DataType.Int32,value:11});

        Frequenz.value.setValueFromSource({dataType: DataType.String, value: "60 Hz"});
        Frequenz.valueType.setValueFromSource({dataType:DataType.Int32,value:11});

        SignalType.value.setValueFromSource({dataType: DataType.String, value: "AC"});
        SignalType.valueType.setValueFromSource({dataType:DataType.Int32,value:11});
     
        BedDimensions.value.setValueFromSource({dataType: DataType.String, value: "200mm x 200mm"});
        BedDimensions.valueType.setValueFromSource({dataType:DataType.Int32,value:11});

        Height.value.setValueFromSource({dataType: DataType.String, value: "320mm"});
        Height.valueType.setValueFromSource({dataType:DataType.Int32,value:11});

        Width.value.setValueFromSource({dataType: DataType.String, value: "300mm"});
        Width.valueType.setValueFromSource({dataType:DataType.Int32,value:11});

        Weight.value.setValueFromSource({dataType: DataType.String, value: "3.2Kg"});
        Weight.valueType.setValueFromSource({dataType:DataType.Int32,value:11});

        Materials.value.setValueFromSource({dataType: DataType.String, value: "PLA, ABS, PETG, ASA, TPU, TPE"});
        Materials.valueType.setValueFromSource({dataType:DataType.Int32,value:11});

        MaxPrintVelocity.value.setValueFromSource({dataType: DataType.String, value: "80mm/s a 0.1mm de altura"});
        MaxPrintVelocity.valueType.setValueFromSource({dataType:DataType.Int32,value:11});

        MaxTempBed.value.setValueFromSource({dataType: DataType.String, value: "110°C"});
        MaxTempBed.valueType.setValueFromSource({dataType:DataType.Int32,value:11});

        MaxTempNozzle.value.setValueFromSource({dataType: DataType.String, value: "250°C"});
        MaxTempNozzle.valueType.setValueFromSource({dataType:DataType.Int32,value:11});


        // Referencias

        SM_Technical_Data.addReference({referenceType: "HasInterface", nodeId: IAASIdentifiableType});











        // --- SUBMODELO DE DOCUMENTATION ----------------------------------------------------------------------------------------------------------
        
        // --- INSTANCIAMIENTO ------------------------------------------
        const SM_Documentation = AASSubmodelType.instantiate({
            browseName: "SubmodeloDocumentacion",
            componentOf: AAS
        });
        const SM_Documentation_Id = AASIdentifierType.instantiate({
            browseName: "Identification",
            componentOf: SM_Documentation
        });
        const SM_Element_Operational_Documents = AASSubmodelElementCollectionType.instantiate({
            browseName: "DocumentosOperacionales",
            componentOf: SM_Documentation,
            optionals: ["AllowDuplicates"]
        });

        const Operation_Manual = AASFiletype.instantiate({
            browseName: "ArchivoDeManualDeOperacion",
            componentOf: SM_Element_Operational_Documents,
            optionals: ["File"]
        });

        // Definir el primer archivo Operating Manual
        Operation_Manual.mimeType.setValueFromSource({dataType: "String", value: "application/pdf"});
        Operation_Manual.value.setValueFromSource({dataType: "String", value: "/aasx/ManualDeOperacion.pdf"});
        Operation_Manual.file.size.setValueFromSource({dataType: "UInt64", value: 2500});
        Operation_Manual.file.userWritable.setValueFromSource({dataType: "Boolean", value: false});
        Operation_Manual.file.writable.setValueFromSource({dataType: "Boolean", value: false});
        
        


        // --- MAPEO ------------------------------------------------------
        SM_Documentation_Id.id.setValueFromSource({dataType: DataType.String, value: "https:/www.javerianacali.edu.co/cap/Documentacion3DPRUSA/1/1"});
        SM_Documentation_Id.idType.setValueFromSource({dataType: DataType.Int32, value: 1});


        // --- SUBMODELO DE OPERATIONAL DATA ----------------------------------------------------------------------------------------------
        
        // --- ISNTANCIAMIENTO -----------------------------------------------------
        const SM_Operational = AASSubmodelType.instantiate({
            browseName: "SubmodeloInformacionOperacional",
            componentOf: AAS
        });
        const SM_Operational_Id = AASIdentifierType.instantiate({
            browseName: "Identification",
            componentOf: SM_Operational
        });

        // --- MAPEO

        // VALORES

        SM_Operational_Id.id.setValueFromSource({dataType: DataType.String, value: "https:/www.javerianacali.edu.co/cap/Operacional3DPRUSA/1/1"});
        SM_Operational_Id.idType.setValueFromSource({dataType: DataType.Int32, value: 1});

        setInterval(function(){ Tb+=1; console.log(Tb)}, 10000);
       
        const TempBase = namespace.addAnalogDataItem({
            componentOf: SM_Operational,
            nodeId: "ns=1;i=2022",
            browseName: "TemperaturaBase",
            definition: "Temperatura de la base caliente",
            valuePrecision: 0.01,
            engineeringUnitsRange: { low: 100, high: 200 },
            instrumentRange: { low: -100, high: +200 },
            engineeringUnits: standardUnits.degree_celsius,
            dataType: "Double",
            value: {
                get: () => new Variant({ dataType: DataType.Double, value: Tb})
            },
        });
        const TempExtr = namespace.addAnalogDataItem({
            componentOf: SM_Operational,
            nodeId: "ns=1;i=2023",
            browseName: "TemperaturaMotorExtrusor",
            definition: "Temperatura del extrusor",
            valuePrecision: 0.01,
            engineeringUnitsRange: { low: 100, high: 200 },
            instrumentRange: { low: -100, high: +200 },
            engineeringUnits: standardUnits.degree_celsius,
            dataType: "Double",
            value: {
                get: () => new Variant({ dataType: DataType.Double, value: Te})
            },
        });
        const TempMotor = namespace.addAnalogDataItem({
            componentOf: SM_Operational,
            nodeId: "ns=1;i=2024",
            browseName: "TemperaturaMotor",
            definition: "Temperatura del motor eje y",
            valuePrecision: 0.01,
            engineeringUnitsRange: { low: 100, high: 200 },
            instrumentRange: { low: -100, high: +200 },
            engineeringUnits: standardUnits.degree_celsius,
            dataType: "Double",
            value: {
                get: () => new Variant({ dataType: DataType.Double, value: Tm})
            },
        });

       /*  const device = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "MyDevice"
        });

        add some variables
        add a variable named MyVariable1 to the newly created folder "MyDevice"
        let variable1 = 1;
        
        // emulate variable1 changing every 500 ms
        setInterval(function(){  variable1+=1; }, 2000);
        
        namespace.addVariable({
            componentOf: device,
            browseName: "MyVariable1",
            dataType: "Double",
            value: {
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.Double, value: variable1 });
                }
            }
        });
        
        add a variable named MyVariable2 to the newly created folder "MyDevice" */
        /* let variable2 = 10.0;
        setInterval(function(){  variable2+=1; 
        console.log(variable2);
        
        }, 2000);
        console.log(variable2); */
        /* namespace.addVariable({
        
            componentOf: device,
        
            nodeId: "ns=1;b=1020FFAA", // some opaque NodeId in namespace 4
        
            browseName: "MyVariable2",
        
            dataType: "Double",    
        
            value: {
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.Double, value: variable2 });
                },
                set: function (variant) {
                    variable2 = parseFloat(variant.value);
                    return opcua.StatusCodes.Good;
                }
            }
        }); */
        
        //const os = require("os");
        /*
         * returns the percentage of free memory on the running machine
         * @return {double}
         */
        /* function available_memory() {
            // var value = process.memoryUsage().heapUsed / 1000000;
            const percentageMemUsed = os.freemem() / os.totalmem() * 100.0;
            return percentageMemUsed;
        } */
        /* namespace.addVariable({
        
            componentOf: device,
        
            nodeId: "s=free_memory", // a string nodeID
            browseName: "FreeMemory",
            dataType: "Double",    
            value: {
                get: function () {return new opcua.Variant({dataType: opcua.DataType.Double, value: available_memory() });}
            }
        }); */
    }
    construct_my_address_space(server);
    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });
}
server.initialize(post_initialize);
const port = new SerialPort(
    "COM5",
    {baudRate: 115200},
    function (err) {
        if (err) {
          return console.log('Error al abrir puerto: ', err.message);
        }
    }
);

const parser = new SerialPort.parsers.Readline();

port.pipe(parser);

parser.on('data', (line)=>{
    if(line.search("T:") != -1){
        Te = Number(line.slice(line.search('T')+2,line.search('/')-1));
        Tb = Number(line.slice(line.search('B')+2,line.search('@')-7));
        console.log("Tb =",Tb);
        console.log("Te =",Te);
    }
    console.log(line);
});
port.on('open', function(){
    console.log('puerto serial abierto');
});

port.on('err', function(err){
    console.log("Fallo con la conexion serial");
});

setTimeout(()=>{
    port.write("M155 S4\r\n");  // Pedir temperaturas cada 4 segundos (Evita errores en la impresion)
},10000);
