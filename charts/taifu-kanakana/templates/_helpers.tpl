{{- define "taifu-kanakana.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "taifu-kanakana.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "taifu-kanakana.labels" -}}
app.kubernetes.io/name: {{ include "taifu-kanakana.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version }}
{{- end -}}

{{- define "taifu-kanakana.selectorLabels" -}}
app.kubernetes.io/name: {{ include "taifu-kanakana.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
