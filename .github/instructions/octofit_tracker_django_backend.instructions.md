---
applyTo: "octofit-tracker/backend/**"
---
# Octofit-tracker Fitness App Django backend Guidelines


## Django Backend App structure

### settings.py

Should always contain the following

```python
# WARNING: The following setting is only safe for development.
# Do NOT use ALLOWED_HOSTS = ['*'] in production, as it allows any host to access your application.
# For production, set ALLOWED_HOSTS to a list of your domain names, e.g.:
# ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
ALLOWED_HOSTS = ['*']
```