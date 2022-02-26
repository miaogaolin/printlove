package api

import (
	"github.com/miaogaolin/gotl/common/sql2gorm/parser"
	"github.com/miaogaolin/gotl/response"
	"net/http"
)

func SqlToGorm(w http.ResponseWriter, r *http.Request) {
	ddl := r.PostForm.Get("ddl")
	res, err := parser.ParseSqlFormat(ddl,
		parser.WithGormType(),
		parser.WithJsonTag(),
	)
	w.Header().Set("Content-Type", "application/json")
	if err != nil {
		response.WriteError(w, err)
		return
	}
	response.WriteSuccess(w, string(res))
}
