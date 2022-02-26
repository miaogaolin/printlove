package api

import (
	"bytes"
	"errors"
	xml2json "github.com/basgys/goxml2json"
	"github.com/cch123/elasticsql"
	"github.com/miaogaolin/gotl/common/sql2gorm/parser"
	"github.com/miaogaolin/gotl/common/sql2gozero/gen"
	"github.com/miaogaolin/gotl/common/yaml2go"
	"github.com/miaogaolin/gotl/response"
	sql2ent "github.com/miaogaolin/sql2ent/parser"
	"github.com/tal-tech/go-zero/tools/goctl/config"
	"net/http"
	"os"
)

func Tool(w http.ResponseWriter, r *http.Request)  {
	method := r.PostFormValue("method")
	var (
		err error
		data string
	)
	input := r.PostFormValue("input")
	switch method {
	case "sql2ent":
		data, err = sql2ent.Parse(input)
	case "sql2es":
		data, _, err = elasticsql.Convert(input)
	case "xml2json":
		b, e := xml2json.Convert(bytes.NewBufferString(input),
			xml2json.WithTypeConverter(xml2json.Float))
		data = b.String()
		err = e
	case "yaml2go":
		yaml := yaml2go.New()
		data, err = yaml.Convert([]byte(input))
	case "sql2gorm":
		res, e := parser.ParseSqlFormat(input,
			parser.WithGormType(),
			parser.WithJsonTag(),
		)
		data = string(res)
		err = e
	case "sql2gozero":
		cache := r.PostFormValue("cache")
		data, err = SqlToGoZero(input, cache)
	}

	w.Header().Set("Content-Type", "application/json")
	if err != nil {
		response.WriteError(w, err)
		return
	}
	response.WriteSuccess(w, data)
}


func SqlToGoZero(ddl, cache string) (string, error){
	os.Setenv("HOME", "./")
	g, err := gen.NewGenerator("model", &config.Config{NamingFormat: config.DefaultFormat})
	if err != nil {
		return "", err
	}

	isCache := false
	if cache == "1" {
		isCache = true
	}

	res, err := g.GenFromDDContent([]byte(ddl), isCache, "")
	if err != nil {
		return "", err
	}

	for _, v := range res {
		return v, nil
	}
	return "", errors.New("empty")
}
