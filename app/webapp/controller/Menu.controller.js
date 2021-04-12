sap.ui.define([
        "./BaseController"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController) {
		"use strict";

		return BaseController.extend("treinamento.l4e.app.controller.Menu", {
			onInit: function () {

            },
            /*onNavCadastroPlataforma função para navegar para a página Cadastro de plataforma*/
            onNavCadastroPlataforma : function(){
                this.getRouter().navTo("CadastroPlataforma");
            },
            /*onNavConsultaPlataforma função para navegar para a página Consulta de plataforma*/
            onNavConsultaPlataforma : function(){
                this.getRouter().navTo("ConsultaPlataforma");
            }
		});
	});
