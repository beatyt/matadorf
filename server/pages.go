package main

import (
	"log"
	"math/rand"
	"time"
)

type Pages struct {
	Pages map[string]StacktracePage `json:"pages"`
}

type StacktracePage struct {
	Timestamp time.Time `json:"timestamp,omitempty"`
	Text      string    `json:"stacktrace,omitempty"`
	Url       string    `json:"url,omnitempty"`
}

type Dictionary struct {
	Words []string `json:"strings"`
}

func init() {
	rand.Seed(time.Now().UTC().UnixNano())
}

func (t Dictionary) generateUrl() string {
	var response string
	for {
		n1 := rand.Int() % len(t.Words)
		n2 := rand.Int() % len(t.Words)
		n3 := rand.Int() % len(t.Words)
		response = t.Words[n1] + t.Words[n2] + t.Words[n3]
		log.Printf("Here is a random word %s", response)
		if n1 != n2 && n2 != n3 && n3 != n1 {
			return response
		}
	}
}
