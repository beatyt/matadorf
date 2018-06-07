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

var pages Pages
var dict Dictionary

// go run server.go
func main() {
	log.Println("Starting...")
	input, err := ioutil.ReadFile("dict.json")
	if err != nil {
		log.Fatal(err)
	}

	json.Unmarshal(input, &dict)

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

func loadFile(path string) Pages {
	raw, err := ioutil.ReadFile(path)
	if err != nil {
		log.Println(err)
	}

	log.Println("file=" + string(raw))

	json.Unmarshal(raw, &pages)

	if pages.Pages == nil {
		log.Println("pages is nil")
	}

	return pages
}

func explore(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pages := loadFile("file.json")
	js, err := json.Marshal(pages)
	if err != nil {
		log.Println(err)
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
	pages.Pages[url] = StacktracePage{time.Now(), string(body), url}

	js, err := json.Marshal(pages)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	ioutil.WriteFile("file.json", js, 0666)

	js, err = json.Marshal(pages.Pages[url])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(js)
	log.Printf("Returning json response to client: \n %s", js)
}

// For effeciency could change this array to map and restructure
func getPage(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	page := ps.ByName("page")
	log.Printf("Requested page %s", page)

	pages := loadFile("file.json")

	stacktracePage := pages.Pages[page]

	js, err := json.Marshal(stacktracePage)
	if err != nil {
		log.Println(err)
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
