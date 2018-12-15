# valuetransfer

## Project setup
```
install node
npm install @vue/cli -g 
vue create my-app
cd my-app
vue add vuetify
npm install

```

### Compiles
```
# Compiles and hot-reloads for development
npm run serve

# Compiles and minifies for production
npm run build

```

### Planned enhancements

```

install raspberian on SD Card
!!! firebase config and other keys must be installed on SD card beforehand !!!


- low voltage: bought cable and it works

user: pi
password: raspberry

set up keyboard and time
sudo nano /etc/default/keyboard
sudo dpkg-reconfigure locales

sudo apt-get update
sudo apt-get upgrade

sudo apt-get install nginx

- delete
sudo rm /var/www/html/*.*
- copy
sudo cp -f /home/pi/bebbo-zz.github.io/*.* /var/www/html

sudo apt-get install -y git
git config --global user.name "bebbo-zz"
git config --global user.email martin.brehm@web.de
git clone https://github.com/bebbo-zz/pythonserver.git


- proxy fuer nginx richtig einstellen 

sudo apt-get install -y python-pip

sudo pip install virtualenv
mkdir flask_app
cd flask_app
virtualenv env       (creating virtual envrione in this folder)
source env/bin/activate
sudo pip install flask gunicorn
gunicorn hello:app    (sowas wie dateiname:mainfunctionname)

- for an update either in the server or website
git pull origin master

sudo python webserver.py
(right now 192.178.168.123)

git clone https://github.com/bebbo-zz/valuetransfer.git
cd valuetransfer
npm set audit false
npm install
npm run build

- restart webserver
sudo /etc/init.d/nginx restart

Crtl + F1-12 for different process


sudo reboot

start two processes automatically after reboot
sudo nano /etc/rc.local
su pi -c 'node /home/pi/NAMEOFDICRECTORY/server.js < /dev/null &'
(curl -sL https://deb.nodesource.com/setup_10.x | bash -
sudo apt-get install -y nodejs)


- how to automatically answer questions with y when installing and more disk space is required???

- run phyton APIs on raspberry pi 
    http://mattrichardson.com/Raspberry-Pi-Flask/
    

    a) for getting print job and calling web socket from there
    https://realpython.com/python-sockets/#echo-client
    https://www.w3resource.com/python/python-bytes.php

    b) and updating git files, basically run terminal commands


- edit files when there is no IDE. probably that is not the plan. rather good deployment strategy that would work everywhere. update on click

- start node server and python server whenever raspberry pi switches on and restart once terminated

- vue call ipad camera
- camera will recognize barcode
- user management
- create a new user with password and add him (here named admin) to sudo and adm group and later revoke the rights of the default user pi
    sudo adduser admin
    sudo adduser admin sudo
    sudo adduser admin adm
    sudo deluser pi sudo
    sudo deluser pi adm

```
