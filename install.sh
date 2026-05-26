#!/bin/bash


NODE_PATH=$1
PROJECT_PATH=${2:-$(pwd)}
SERVICE_NAME=${3:-'nice-jokes'} # To use it must to set a project path explicitly (User could use pwd command to fill that param)

if [ -z $NODE_PATH ] || [ ! -f $NODE_PATH ]; then
  echo "ERROR: NODE PATH REQUIRED"
  exit 1
fi

# Some utils
TEMP_FILE="/tmp/unit-file"

replaceOnTempUnit() {
  PATTERN=$1
  VALUE=$2
  
  echo "PATTERN: $PATTERN,VALUE: $VALUE"

  if [ -z $PATTERN ] || [ -z $VALUE ]; then
    echo "Error, pattern or value are empty"
    return 1
  fi 

  sed -i "s|$PATTERN|$VALUE|g" $TEMP_FILE
  return 0
}

# Check if exists the command
commands=('systemctl' 'sed')

for dep in "${commands[@]}"
do 
  if ! command -v "$dep" >/dev/null 2>&1; then 
    echo "Error: The system doesn't have/support this command: '$dep'";
    exit 1;
  fi
done

echo "Creating temporal unit.service file"

if ! cp ./unit-file $TEMP_FILE; then
  echo "Error creating temporary file"
  exit 1
fi

echo "Replacing parameters on temporal file..."

declare -A REPLACEMENTS=(
  ['{{NODE_PATH}}']=$NODE_PATH 
  ['{{PROJECT_PATH}}']=$PROJECT_PATH
)
for key in ${!REPLACEMENTS[@]} 
do
  echo "KEY: $key, VALUE: ${REPLACEMENTS[$key]}"
  if ! replaceOnTempUnit $key ${REPLACEMENTS[$key]}; then
    echo "Error making the replacement on temporal file!!"
    exit 1
  fi
done

echo "Temporal file params setted" 

if ! cp /tmp/unit-file "/etc/systemd/system/$SERVICE_NAME.service"; then
  echo "Error copying file."
  exit 1
fi

echo "Service file setted correctly."

rm -f $TEMP_FILE

systemctl daemon-reload
systemctl enable $SERVICE_NAME
systemctl start $SERVICE_NAME

echo 'Service installation successfully'
exit 0
