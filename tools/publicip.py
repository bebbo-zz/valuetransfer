import requests
import firebase_admin

from firebase_admin import credentials
from firebase_admin import firestore
from requests import get

ip = get('https://api.ipify.org')
if ip.status_code != 200:
  print("error")
else:
  print(ip.text)
  cred = credentials.Certificate('serviceAccount.json')
  firebase_admin.initialize_app(cred)

  db = firestore.client()

  data = { u'publicip': ip.text }
  db.collection(u'systemcontrol').document(u'pubip').set(data)