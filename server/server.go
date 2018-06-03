package main

import (
	"encoding/json"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

var pages []map[string]StacktracePage
var dict Dictionary

// go run server.go
func main() {
	log.Println("Starting...")
	input, err := ioutil.ReadFile("dict.json")
	if err != nil {
		log.Fatal(err)
	}

	json.Unmarshal(input, &dict)

	// read in file
	file, err := ioutil.ReadFile("file.txt")
	if err != nil {
		log.Fatal(err)
	}

	json.Unmarshal(file, &pages)
	// routers
	router := httprouter.New()
	// mux.HandleFunc("/upload", uploadFile)
	router.POST("/submit", submit)
	router.GET("/explore", explore)
	router.GET("/pages/:page", getPage)

	handler := cors.Default().Handler(router)
	httpError := http.ListenAndServe(":3002", handler)
	if httpError != nil {
		log.Println("While serving HTTP: ", httpError)
	}
	log.Println("Running")
}

func explore(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	js, err := json.Marshal(pages)
	if err != nil {
		log.Fatal(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(js)
	log.Printf("Returning json response to client \n %s", js)
}

func submit(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	log.Println("method:", r.Method)
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	url := dict.generateUrl()
	var data map[string]StacktracePage
	data = make(map[string]StacktracePage)
	data[url] = StacktracePage{time.Now(), string(body)}
	pages = append(pages, data)

	js, err := json.Marshal(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	ioutil.WriteFile("file.txt", js, 0666)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(js)
	log.Printf("Returning json response to client: \n %s", js)
}

// For effeciency could change this array to map and restructure
func getPage(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	page := ps.ByName("page")
	log.Printf("Requested page %s", page)

	var stacktracePage StacktracePage
	for _, element := range pages {
		for key, value := range element {
			log.Println(key, "=", value)
			if key == page {
				stacktracePage = value
			}
		}
	}

	js, err := json.Marshal(stacktracePage)
	if err != nil {
		log.Fatal(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(js)
	log.Printf("Returning json response to client \n %s", js)
}

// func uploadFile(w http.ResponseWriter, r *http.Request) {
// 	log.Println("method:", r.Method)
// 	if r.Method != http.MethodPost {
// 		http.Redirect(w, r, "/", http.StatusSeeOther)
// 		return
// 	}

// 	file, handle, err := r.FormFile("file")
// 	if err != nil {
// 		log.Println(w, "%v", err)
// 		return
// 	}
// 	defer file.Close()

// 	mimeType := handle.Header.Get("Content-Type")
// 	log.Println("mimeType", mimeType)

// 	saveFile(w, file, handle)
// }

// func saveFile(w http.ResponseWriter, file multipart.File, handle *multipart.FileHeader) {
// 	data, err := ioutil.ReadAll(file)
// 	if err != nil {
// 		log.Println(w, "%v", err)
// 		return
// 	}

// 	err = ioutil.WriteFile("./files/"+handle.Filename, data, 0666)
// 	if err != nil {
// 		log.Println(w, "%v", err)
// 		return
// 	}

// 	createJsonResponse(w, handle)
// }

// func createJsonResponse(w http.ResponseWriter, handle *multipart.FileHeader) {
// 	log.Println("Filename:", handle.Filename)
// 	stacktracePage := StacktracePage{"test", time.Now()}

// 	js, err := json.Marshal(stacktracePage)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusCreated)
// 	w.Write(js)
// 	log.Println(w, "File uploaded successfully")
// 	log.Println("Returning json response to client:", js)
// }
