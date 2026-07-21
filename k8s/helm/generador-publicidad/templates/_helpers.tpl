{{- define "generador-publicidad.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "generador-publicidad.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "generador-publicidad.namespace" -}}
{{- default .Release.Namespace .Values.namespace }}
{{- end }}

{{- define "generador-publicidad.frontendDomain" -}}
{{- printf "app.%s.%s" .Values.clusterIP .Values.domain }}
{{- end }}

{{- define "generador-publicidad.backendDomain" -}}
{{- printf "api.%s.%s" .Values.clusterIP .Values.domain }}
{{- end }}

{{- define "generador-publicidad.labels" -}}
app.kubernetes.io/name: {{ include "generador-publicidad.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
