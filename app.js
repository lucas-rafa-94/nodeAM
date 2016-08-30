var https = require("https");
var http = require("http")
var express = require ("express");
var bodyParser = require ("body-parser");

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
		
		
		//indexNome = responseBody.toString().indexOf("Medicamento");
		indexApresentacao = responseBody.toString().indexOf("class=\"TituloBula\" title=\"Apresentação")
		indexPosologia = responseBody.toString().indexOf("class=\"TituloBula\" title=\"Posologia");
		indexIndicacao = responseBody.toString().indexOf("class=\"TituloBula\" title=\"Indi");
		indexContraIndicacao = responseBody.toString().indexOf("class=\"TituloBula\" title=\"Contra");

		//if (indexNome  !== -1) {
		
				
		//	while(descricaoNome.toString().indexOf("-") === -1){
			
		//	descricaoNome = descricaoNome.concat(responseBody.toString().charAt(indexNome).toString());
		//	indexNome++;
			
		//	}

		//	var finalNome = descricaoNome.replace("Medicamento", "");
			
		//	jsonSaida.nome = finalNome.replace("-", "").trim();
			
			
		//}else{
		//	console.log(indexPosologia);
		//}


		jsonSaida.nome = req.body.path;

		if (indexPosologia  !== -1) {
		
				
			while(descricao.toString().indexOf("<div class=\"Espaco40px\"></div>") === -1){
			
			descricao = descricao.concat(responseBody.toString().charAt(indexPosologia).toString());
			indexPosologia++;
			
			}

			final = descricao.split("</div>")[1];
			var final2 = final.split("<div")[0];
			jsonSaida.posologia = final2.stripHTML().trim();
			//console.log(final2);
			
		}else{
			//console.log(indexPosologia);
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
		//console.log(indexIndicacao);
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
			
			//res2.send(jsonSaida);
			
		}else{
			//console.log(indexApresentacao);
			jsonSaida.apresentacao = "not found"
		}

		res2.send(jsonSaida);

		});
	});



	req.on("error", function(err) {
	console.log(`problem with request: ${err.message}`);
	});

	reqGet.end();

	

	}));

app.listen(port, function (argument) {
	console.log("App is running " + port)
});

console.log("Server runnig....");