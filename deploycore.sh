cp -v * $1
cp -rv includes $1
cp -rv misc $1
cp -rv modules $1
cp -rv profiles $1
cp -rv scripts $1
cp -rv themes $1
mkdir -p $1sites/default/files
chmod 777 $1sites/default/files
cp -rv sites/default/* $1sites/default/
