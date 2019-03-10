# valuetransfer

## data model 
```

# POS part
products
orders
intakes

# accounting
invoices (for supplier and customer)
accoutingentries (based on invoices or free)
stock
businesspartner


supplier invoices add to intakes and stock
customer invoices add to orders and remove from stock

```

## Run Open Source POS
```

# Prerequsists

Get an Github account for the hosting on GitPages
https://github.com/

Get an free Firebase account
https://firebase.google.com/

Install NodeJS
https://nodejs.org

Install Git
https://git-scm.com/


# firebase setup

- New Project
- Add Firestore


# Get POS and configure it

Clone and download POS repository
https://github.com/bebbo-zz/valuetransfer

Extract repository to any folder X.
in ...X\src\components\ add an file firebaseConfig.js
and copy the following information from your firebase account under Authentication > Web Setup (top right corner)
export default {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "..."
}

navigate in console into folder X and run the following commands:
npm run build


# Deploy POS



```

## Project setup
```
install node
npm install @vue/cli -g 
vue create my-app
cd my-app
vue add vuetify
npm install

```

### DevOps
```
# Compile and Deploy Frontend
# on Mac
cd ~/Documents/Development/Vue/valuetransfer
npm run build
sudo cp -r ~/Documents/Development/Vue/valuetransfer/dist/* ~/Documents/Development/POS/pos_prod_frontend/
cd ~/Documents/Development/POS/pos_prod_frontend/
git add .
git commit -am "new deployment"
git push -u origin master

# on raspberry
sudo /etc/init.d/nginx stop
cd /home/grafflmartin/deployment/pos_prod_frontend/
sudo git pull origin master
sudo rm -rf /var/www/html/*
sudo cp -r /home/grafflmartin/deployment/pos_prod_frontend/* /var/www/html
sudo /etc/init.d/nginx restart


# Python IP Service



# Compile and Deploy Backend
cd /home/martin/Documents/Java/javaserver
mvn package
java -jar target/pos-javaserver-0.1.0.jar

```

### Planned Enhancements

```
- vue call ipad camera
- camera will recognize barcode
- user management

```


### Production Environment

```

install raspberian on SD Card
!!! firebase config and other keys must be installed on SD card beforehand !!!


- low voltage: bought cable and it works

user: pi
password: raspberry

start/stop/check a script:
    sudo systemctl start javaserver
    sudo systemctl stop javaserver
    sudo systemctl status javaserver

    sudo /etc/init.d/nginx start
    sudo /etc/init.d/nginx restart
    sudo /etc/init.d/nginx stop


set up keyboard and time
sudo nano /etc/default/keyboard
sudo dpkg-reconfigure locales
sudo nano /etc/rc.local

sudo apt-get update
sudo apt-get upgrade

sudo apt-get install -y nginx

curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"name":"value"}' http://localhost:8080/app/process


sudo apt-get install -y git
git config --global user.name "bebbo-zz"
git config --global user.email martin.brehm@web.de
git clone https://github.com/bebbo-zz/pythonserver.git



git clone https://github.com/bebbo-zz/valuetransfer.git
cd valuetransfer
npm set audit false
npm install
npm run build


Crtl + F1-12 for different process

sudo reboot

cd /etc/nginx/sites-available
sudo nano default

location /app {
	     proxy_pass http://localhost:8083/;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
             proxy_set_header X-Forwarded-Port $server_port;
	}

- init script
all scripts are in:
    /etc/systemd/system/

[Unit]
Description=POS Backend Java
After=syslog.target
After=network.target[Service]
User=username
Type=simple

[Service]
ExecStart=/usr/bin/java -jar /home/pi/deployment/pos_prod_backend/pos-javaserver-0.1.0.jar
Restart=no
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=javaserver

[Install]
WantedBy=multi-user.target



- create a new user with password and add him (here named admin) to sudo and adm group and later revoke the rights of the default user pi
    sudo adduser admin
    sudo adduser admin sudo
    sudo adduser admin adm

    then stop services and
    mv /home/pi/* /home/grafflmartin/

    sudo deluser pi sudo
    sudo deluser pi adm


    su pi -c 'node /home/pi/NAMEOFDICRECTORY/server.js < /dev/null &'
(curl -sL https://deb.nodesource.com/setup_10.x | bash -
sudo apt-get install -y nodejs)
sudo apt-get install -y python-pip

sudo pip install virtualenv
mkdir flask_app
cd flask_app
virtualenv env       (creating virtual envrione in this folder)
source env/bin/activate
sudo pip install flask gunicorn
gunicorn hello:app    (sowas wie dateiname:mainfunctionname)

sudo python webserver.py

```


