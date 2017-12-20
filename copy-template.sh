DIRECTORY="solutions/$1"
TEMPLATE="solutions/template"

if [ ! -d "$DIRECTORY" ]; then
  echo "Creating $DIRECTORY from template: $TEMPLATE"
  cp -r $TEMPLATE $DIRECTORY
else
  echo "Path $DIRECTORY already exists, doing nothing."
fi
