{{- $params := $.Site.Params -}}
window.params = {
    utterances: {
        repo: {{ default "" $params.utterances.repo | printf "%q" }},
        theme: {{ default "" $params.utterances.theme | printf "%q" }},
        issueTerm: {{ default "pathname" $params.utterances.issueTerm | printf "%q" }},
        label: {{ default "comment" $params.utterances.label | printf "%q" }},
    },
}