rm -rv $1sites/all/themes/*
mkdir -p $1sites/all/themes
cp -rv sites/all/themes/* $1sites/all/themes/

chgrp admin -R $1sites/all/themes
chmod g+w -R $1sites/all/themes