sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",//Biblioteca do Json usada no success(data) 
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
	],

	function (BaseController, JSONModel, MessageBox, Filter,FilterOperator) {
        "use strict";
        
		return BaseController.extend("treinamento.l4e.app.controller.ConsultaPlataforma", {
            ///vai chamar a função handleRouteMatched
            onInit: function () {  
                this.getRouter().getRoute("ConsultaPlataforma").attachPatternMatched(this.handleRouteMatched, this);
            },
           
           
           
            //função async - processa em fila, um de cada vez. || Responsável em retirar os dados da API
            handleRouteMatched: async function(){
                var that = this;
                // Busca todas as plataformas cadastrados (GET)
                await
                $.ajax({
                    "url": "/api/plataformas",
                    "method": "GET",
                    success(data){
                        that.getView().setModel(new JSONModel(data), "Plataforma")// Nome do JSON
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar as plataformas.")
                    },
                })
            },

            // Função do botão 'Excluir'
            onExcluir: async function(oEvent){
                var id = oEvent.getParameter('listItem').getBindingContext("Plataforma").getObject().id; // pega o ID do parceiro selecionado
                this.getView().setBusy(true);

                // Método DELETE para deletar um registro 
                await
                $.ajax({
                    "url": `/api/plataformas/${id}`,
                    "method": "DELETE",
                    success(data){
                        MessageBox.success("Excluído com sucesso!")
                    },
                    error(){
                        MessageBox.error("Não foi possível excluir a Plataforma.")
                    }

                });
                await this.handleRouteMatched(); // chama a função para recarregar os dados da tabela
                this.getView().setBusy(false);

            },

            // Função do botão editar da tabela
            onNavEditarPlataforma: function(oEvent){
                var plataformaId = oEvent.getSource().getBindingContext("Plataforma").getObject().id; // atribui o id da Plataforma a variavel plataformaid selecionado
                this.getRouter().navTo("EditarPlataforma", {id: plataformaId}); // chama a rota de edição passando o id da plataforma selecionado
            },

            // Função do campo de busca (SearchField)
            onSearch: function(oEvent){
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("nome", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                var oList = this.byId("tablePlataforma");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            } 
		});
	});
