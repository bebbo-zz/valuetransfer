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

### DevOps
```
# Compile and Deploy Frontend
cd /home/martin/Documents/Vue/valuetransfer
npm run build

# locally
sudo /etc/init.d/nginx stop
sudo rm -f /var/www/html/*
sudo cp -r /home/martin/Documents/Vue/valuetransfer/dist/* /var/www/html
sudo /etc/init.d/nginx restart

# on raspberry
cd /home/martin/Documents/Deployment/frontend
sudo rm /home/martin/Documents/Deployment/frontend/*
cp -r /home/martin/Documents/Vue/valuetransfer/dist/* /home/martin/Documents/Deployment/frontend
git add *
git commit -am "new deployment"
git push -u origin master


# Compile and Deploy Backend


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

set up keyboard and time
sudo nano /etc/default/keyboard
sudo dpkg-reconfigure locales
sudo nano /etc/rc.local

sudo apt-get update
sudo apt-get upgrade

sudo apt-get install -y nginx
sudo /etc/init.d/nginx start
sudo /etc/init.d/nginx restart
sudo /etc/init.d/nginx stop

curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"name":"value"}' http://localhost:8080/app/process

- delete
sudo rm /var/www/html/*
- copy
sudo cp -f -r /home/pi/bebbo-zz.github.io/* /var/www/html

sudo apt-get install -y git
git config --global user.name "bebbo-zz"
git config --global user.email martin.brehm@web.de
git clone https://github.com/bebbo-zz/pythonserver.git

java -jar target/pos-javaserver-0.1.0.jar
(als process aufsetzen)

- for an update either in the server or website
git pull origin master


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
in /etc/systemd/system/helloworld.service
after that sudo systemctl start helloworld
and sudo systemctl status helloworld

[Unit]
Description=Spring Boot HelloWorld
After=syslog.target
After=network.target[Service]
User=username
Type=simple

[Service]
ExecStart=/usr/bin/java -jar /home/linode/hello-world/build/libs/hello-world-0.0.1-SNAPSHOT.jar
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=helloworld

[Install]
WantedBy=multi-user.target

(right now 192.178.168.123)

- run phyton APIs on raspberry pi 

    b) and updating git files, basically run terminal commands


- edit files when there is no IDE. probably that is not the plan. rather good deployment strategy that would work everywhere. update on click

- start node server and python server whenever raspberry pi switches on and restart once terminated

- create a new user with password and add him (here named admin) to sudo and adm group and later revoke the rights of the default user pi
    sudo adduser admin
    sudo adduser admin sudo
    sudo adduser admin adm
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


