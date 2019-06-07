^C
vagrant [tiny-app]> ps aux | grep node
vagrant  13343 14.9  1.9 1181680 40304 ?       Sl   19:44  10:11 node /vagrant/Bootcamp/Week_2/W2D2/tiny-app/node_modules/.bin/nodemon -L express_server.js
vagrant  15982  1.7  2.0 887684 42108 ?        Sl   20:50   0:02 /home/vagrant/.nvm/versions/node/v8.9.4/bin/node express_server.js
vagrant  16080  0.0  0.0  12940   932 pts/2    S+   20:52   0:00 grep --color=auto node
vagrant [tiny-app]> kill -9 13343
vagrant [tiny-app]> kill -9 15982