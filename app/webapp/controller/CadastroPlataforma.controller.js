sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",//Biblioteca do Json usada no success(data) 
        "sap/m/MessageBox"
	],
	
	function (BaseController, JSONModel, MessageBox) {
		"use strict";

		return BaseController.extend("treinamento.l4e.app.controller.CadastroPlataforma", {
			onInit: function () {
                 // Rota de cadastro
                this.getRouter().getRoute("CadastroPlataforma").attachPatternMatched(this.handleRouteMatched, this);
                // Rota de edição
                this.getRouter().getRoute("EditarPlataforma").attachPatternMatched(this.handleRouteMatchedEditarPlataforma, this);
            },


            // Rota de cadastro
            handleRouteMatched: function(){
                 // Inicia o model com o status "A" (ativo)
                this.getView().setModel(new JSONModel({
                    "status": "A"
                }), "Plataforma");
            },


            // Rota de edição
            handleRouteMatchedEditarPlataforma: async function(){
                var that = this;
                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);
                // Faz a chamada na API para pegar a plataforma selecionado na tabela.
                // Precisamos passar o ID na url para a API retornar apenas os dados do item selecionado.
                await 
                $.ajax({
                    "url": `/api/plataformas/${id}`, // concatena a URL com o ID
                    "method": "GET",
                    success(data) {
                        that.getView().setModel(new JSONModel(data), "Plataforma"); // salva o retorno da API (data) em um Model chamado 'Plataforma'
                    },
                    error() {
                        MessageBox.error("Não foi possível buscar a plataforma.") //Se der erro de API, exibe uma mensagem ao usuário
                    }
                });
                this.getView().setBusy(false);
                
            },


            // Função do elemento 'Switch' da tela
            onChangeSwitch: function(oEvent){// Função para retornar A ou I em vez de True or False
                this.getView().getModel("Plataforma").setProperty("/status", oEvent.getSource().getState() === true ? "A" : "I"); // "?" = If ":" = else
            },


            // Função do botão "Confirmar"
            onConfirmar: async function(){ //Resposável por pegar os dados e armazená-los 
                var that = this;
                var oPlataforma = this.getView().getModel("Plataforma").getData();
                

                // Primeiro é validado se a rota que estamos é a rota de 'EditarPlataforma'
                // Se for, o botão será responsável por atualizar (PUT) os dados
                // Senão, irá criar (POST) um novo registro na tabela
                if(this.getRouter().getHashChanger().getHash().search("EditarPlataforma") === 0){

                    await $.ajax(`api/plataformas/${oPlataforma.id}` , {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },

                        // Cria a estrutura dos dados para enviar para API
                        data: JSON.stringify({
                            "nome": oPlataforma.nome,
                            "tipo": oPlataforma.tipo,
                            "status": oPlataforma.status
                        }),
                        success(){
                            // Se a api retornar sucesso, exibe uma mensagem para o usuário e navega para a tela de "ConsultaPlataformar"
                            MessageBox.success("Editado com sucesso!", {
                                onClose: function() {
                                    that.getRouter().navTo("ConsultaPlataforma");
                                }
                            });
                        },
                        error(){
                            //Se a api retornar erro, exibe uma mensagem ao usuário
                            MessageBox.error("Não foi possível editar o plataforma.");
                        }
                    });

                }else{
                    this.getView().setBusy(true);
                    // Método POST para salvar os dados 
                    await $.ajax("/api/plataformas", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(oPlataforma),
                        success(){
                            MessageBox.success("Salvo com sucesso!");
                        },
                        error(){
                            MessageBox.error("Não foi possível salvar a plataforma.");
                        }
                    })

                    this.getView().setBusy(false);

                }
                
            },

            
            // Função do botão Cancelar
            onCancelar: function(){
                // Se a rota for a de "EditarPlataforma", navega para a tela de Consuta
                // Senão, limpa o model 'Plataforma'
                if(this.getRouter().getHashChanger().getHash().search("EditarPlataforma") === 0){
                    this.getRouter().navTo("ConsultaPlataforma");
                }else{
                    this.getView().setModel(new JSONModel({"status": "A"}), "Plataforma")
                }

                
                
            }
		});
	});
