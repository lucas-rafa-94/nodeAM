var https = require("https");
var http = require("http")
var express = require ("express");
var bodyParser = require ("body-parser");

var buscaPreco = "";

var app = express();

var jsonParser = bodyParser.json()

var jsonSaida = {
	nome: "",
	apresentacao: "",
	posologia : "",
	indicacao : "",
	contraIndicacao :"",
	preco: ""
}

String.prototype.stripHTML = function() {return this.replace(/<.*?>/g, '');}

var descricao = "";
var descricaoIndicacao = "";
var descricaoContraIndicacao = "";
var descricaoApresentacao = "";
var descricaoNome = "";

var final = "";
var finalContraIndicacao = "";

var port = process.env.PORT || 8000


app.post("/remedio", jsonParser, (function (req, res2) {




var path = req.body.path;
	
	var reqGet = http.request("http://www.consultamedicamentos.com.br/bula/"+req.body.path, function(res) {
	
	var responseBody = "";
	descricao = "";

	console.log("Response from server started.");
	console.log(`Server Status: ${res.statusCode} `);
	
	res.setEncoding("UTF-8");

	res.once("data", function(chunk) {
	});

	res.on("data", function(chunk) {
		responseBody += chunk;
	});

	res.on("end", function() {
		
		
		var indexApresentacao = responseBody.toString().indexOf("class=\"TituloBula\" title=\"Apresentação")
		var indexPosologia = responseBody.toString().indexOf("class=\"TituloBula\" title=\"Posologia");
		var indexIndicacao = responseBody.toString().indexOf("class=\"TituloBula\" title=\"Indi");
		var indexContraIndicacao = responseBody.toString().indexOf("class=\"TituloBula\" title=\"Contra");

		jsonSaida.nome = req.body.path;

		if (indexPosologia  !== -1) {
		
				
			while(descricao.toString().indexOf("<div class=\"Espaco40px\"></div>") === -1){
			
			descricao = descricao.concat(responseBody.toString().charAt(indexPosologia).toString());
			indexPosologia++;
			
			}

			final = descricao.split("</div>")[1];
			var final2 = final.split("<div")[0];
			jsonSaida.posologia = final2.stripHTML().trim();
			
			
		}else{
			
			jsonSaida.posologia = "not found";
		}



		if (indexIndicacao  !== -1) {
		 
		
		 while(descricaoIndicacao.toString().indexOf("<div class=\"Espaco40px\"></div>") === -1){
			descricaoIndicacao = descricaoIndicacao.concat(responseBody.toString().charAt(indexIndicacao).toString());
			indexIndicacao++;
           
			}
			
			finalIndicacao = descricaoIndicacao.split("</div>")[1];
			var finalIndicacao2 = finalIndicacao.split("<div")[0].replace("<strong>", " ");
			jsonSaida.indicacao = finalIndicacao2.stripHTML().trim();
			
			
		}else{
		
		jsonSaida.indicacao = "not found";

		}

		if(indexContraIndicacao !== -1){

			while(descricaoContraIndicacao.toString().indexOf("<div class=\"Espaco40px\"></div>") === -1){
				descricaoContraIndicacao = descricaoContraIndicacao.concat(responseBody.toString().charAt(indexContraIndicacao).toString());
				indexContraIndicacao++;
			}
				finalContraIndicacao = descricaoContraIndicacao.split("</div>")[1];
				var finalContraIndicacao2 = finalContraIndicacao.split("<div")[0].replace("<strong>", " ");
				jsonSaida.contraIndicacao = finalContraIndicacao2.stripHTML().trim();

				

			}else{
				//console.log(indexContraIndicacao);
				jsonSaida.contraIndicacao = "not found"
			}


		if (indexApresentacao  !== -1) {
		
				
			while(descricaoApresentacao.toString().indexOf("<div class=\"Espaco40px\"></div>") === -1){
			
			descricaoApresentacao = descricaoApresentacao.concat(responseBody.toString().charAt(indexApresentacao).toString());
			indexApresentacao++;
			
			}

			var finalApresentacao = descricaoApresentacao.split("</div>")[1];
			var finalApresentacao2 = finalApresentacao.split("<div")[0];
			var final = finalApresentacao2.replace("</strong>", "")
			jsonSaida.apresentacao = final.stripHTML().trim();
			
						
		}else{
			
			jsonSaida.apresentacao = "not found"
		}

		});

		req.on("error", function(err) {
		console.log(`problem with request: ${err.message}`);
		});
	
});


		reqGet.end();

}));	

app.post("/remedio/preco", jsonParser, (function (req, res2) {
		
		var reqGetPreco = http.request("http://www.drogariasaopaulo.com.br/"+req.body.path.replace("_","%20")+"?&utmi_p=_&utmi_pc=BuscaFullText&utmi_cp="+req.body.path.replace("_","%20"), function (res3) {

			var responseBody = ""
			res3.setEncoding("UTF-8");

			res3.once("data", function(chunk) {
				
			});

			res3.on("data", function(chunk) {
			responseBody += chunk;
			});

			res3.on("end", function() {
				
				var indexPreco = responseBody.toString().indexOf("bestPrice transition_all");
				var texto = responseBody.toString();
				var precoDesc = "";
				
				if(indexPreco !== -1){

						while(precoDesc.toString().indexOf("pbm-discount") === -1){
							precoDesc = precoDesc.concat(responseBody.toString().charAt(indexPreco).toString());
							indexPreco++;
						}

						var precoDesc2 = precoDesc.split("\"the-price\">")[1];
						jsonSaida.preco = precoDesc2.split("<")[0];

						res2.send(jsonSaida);

				}else{
					jsonSaida.preco = "not found";
				}
				

				
			});

			
			req.on("error", function(err) {
			console.log(`problem with request: ${err.message}`);
			});

			
		});

		reqGetPreco.end();
		

}));
	
	
app.listen(port, function (argument) {
	console.log("App is running " + port)
});

console.log("Server runnig....");