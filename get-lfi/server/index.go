package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
)

const PORT = "1342"

var homePage string = ""
var cssPage string = ""
var secretPage string = ""

func request(url string) string {
	cmd := exec.Command("curl", url)
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		return fmt.Sprintf("Something is wrong %v", err)
	}
	return out.String()
}

func query(w *http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		fmt.Fprintf(*w, fmt.Sprintf("Something is wrong: %v", err))
		return
	}

	url := r.PostFormValue("url") // to get params value with key
	fmt.Fprintf(*w, request(url))
}

func serveSecret(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/secret" {
		errorHandler(w, r, http.StatusNotFound)
		return
	}
	if r.Method == http.MethodGet {
		fmt.Fprintf(w, secretPage)
	} else if r.Method == http.MethodPost {
		query(&w, r)
	} else {
		fmt.Fprintf(w, "Only serve GET and POST")
	}
}

func serveHome(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		errorHandler(w, r, http.StatusNotFound)
		return
	}
	fmt.Fprintf(w, homePage)
}

func serveCSS(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/css/index.css" {
		errorHandler(w, r, http.StatusNotFound)
		return
	}
	fmt.Fprintf(w, cssPage)
}

func errorHandler(w http.ResponseWriter, r *http.Request, status int) {
	w.WriteHeader(status)
	if status == http.StatusNotFound {
		fmt.Fprint(w, "Error 404 not found page")
	}
}

func main() {
	cacheHome, err := ioutil.ReadFile("./templates/index.html")
	if err != nil {
		panic("There is no home page")
	}
	homePage = string(cacheHome)

	cacheCSS, err := ioutil.ReadFile("./static/css/index.css")
	if err != nil {
		panic("There is no index page")
	}
	cssPage = string(cacheCSS)

	cacheSecret, err := ioutil.ReadFile("./templates/secret.html")
	if err != nil {
		panic("There is no secret page")
	}
	secretPage = string(cacheSecret)

	http.HandleFunc("/", serveHome)
	http.HandleFunc("/css/index.css", serveCSS)
	http.HandleFunc("/secret", serveSecret)

	log.Fatal(http.ListenAndServe(":"+PORT, nil))
}
