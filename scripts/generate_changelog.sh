#!/bin/bash

OUTPUT_FILE="/Users/horaciovasconcellos/Publicacao/OpsPilot/CHANGELOG.md"

echo "# Documentação de Software" >  "$OUTPUT_FILE"
echo "## Changelog"                >> "$OUTPUT_FILE"

TAGS=$(git tag --sort=-creatordate)
if [ -z "$TAGS" ]; then
  echo "Nenhuma tag encontrada no repositório."
  exit 1
fi

TAGS_ARRAY=($TAGS)
for ((i=0; i<${#TAGS_ARRAY[@]}; i++)); do
  TAG=${TAGS_ARRAY[$i]}
  NEXT_TAG=${TAGS_ARRAY[$i+1]}
  echo "" >> "$OUTPUT_FILE"
  echo "## $TAG" >> "$OUTPUT_FILE"

  TAG_DATE=$(git log -1 --format=%ad --date=short "$TAG")
  echo "_Data da tag: ${TAG_DATE}_" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"

  if [ -z "$NEXT_TAG" ]; then
    git log "$TAG" --pretty=format:"- %ad %s (%an)" --date=format:'%H:%M:%S' >> "$OUTPUT_FILE"
  else
    git log "$TAG"..."$NEXT_TAG" --pretty=format:"- %ad %s (%an)" --date=format:'%H:%M:%S' >> "$OUTPUT_FILE"
  fi

  echo "" >> "$OUTPUT_FILE"
done

exit 0;
