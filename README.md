# WhatsDesktop
A simple wrapper in electron for Whatsapp Web

I made this wrapper because every social chat has a downloadable package (Signal, Telegram, Skype, Teams) for Linux, except for Whatsapp.
This wrapper saves the cookies after at most 5 seconds post-login, so you don't have to take the phone and read the QR every time.

The refresh you see at the beginning is because whatsapp installs some strange script in the browser which prevents it from loading the page, saying it hasn't a version of chrome recent enough. Forcing a reload without cache seems to override these checks.