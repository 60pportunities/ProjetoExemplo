#!/bin/bash
set -e

# Defina os padrões de arquivos relevantes
FILE_PATTERNS="\.(java|js|ts|py|go|php|cs)$"

# Verifica se estamos na branch principal
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$BRANCH" != "main" && "$BRANCH" != "master" ]]; then
    echo "📛 Branch atual é '$BRANCH'. Análise Sonar será ignorada (só roda na 'main' ou com arquivos específicos)."

    # Verifica se há arquivos relevantes modificados
    CHANGED=$(git diff --cached --name-only | grep -E "$FILE_PATTERNS" || true)
    if [[ -z "$CHANGED" ]]; then
        echo "📂 Nenhum arquivo relevante modificado. Pulando análise SonarQube."
        exit 0
    fi
fi

# Verifica se sonar-scanner está instalado
if ! command -v sonar-scanner &> /dev/null; then
    echo "❌ sonar-scanner não está disponível no PATH."
    exit 1
fi

# Executa a análise
echo "🚀 Executando análise SonarQube na branch '$BRANCH'..."
sonar-scanner
