rm -rv $1sites/all/modules/*
mkdir -p $1sites/all/modules
cp -rv sites/all/modules/* $1sites/all/modules/
rm -rv $1sites/all/libraries/*
mkdir -p $1sites/all/libraries
cp -rv sites/all/libraries/* $1sites/all/libraries/
rm -rv $1sites/all/translations
mkdir -p $1sites/all/translations
cp -rv sites/all/translations/* $1sites/all/translations/

