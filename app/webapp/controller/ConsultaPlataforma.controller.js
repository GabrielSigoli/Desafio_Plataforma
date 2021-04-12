sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",//Biblioteca do Json usada no success(data) 
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, MessageBox, Filter,FilterOperator) {
        "use strict";
        
		return BaseController.extend("treinamento.l4e.app.controller.ConsultaPlataforma", {
            ///vai chamar a função handleRouteMatched
            onInit: function () {  
                this.getRouter().getRoute("ConsultaPlataforma").attachPatternMatched(this.handleRouteMatched, this);
            },
            //função async - processa em fila, um de cada vez
            handleRouteMatched: async function(){
                var that = this;
                // Busca todos os Parceiros cadastrados (GET)
                await
                $.ajax({
                    "url": "/api/plataformas",
                    "method": "GET",
                    success(data){
                        that.getView().setModel(new JSONModel(data), "Plataforma")// Nome do JSON
                        console.log(data);
                        
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar as plataformas.")
                        
                    }
                    
                })

            }
		});
	});
