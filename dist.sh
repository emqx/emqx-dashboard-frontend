rm -rf ../emqx-dashboard/priv/www/*
echo "Deleted"
cp -rf dist/* ../emqx-dashboard/priv/www
echo "Finished"
