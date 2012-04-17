# NoPop

NoPop is a Google Chrome extension that blocks all popups (except on encrypted sites). Some sites seem to get around Chrome's builtin popup blocker and that has always annoyed me, so I built this extension.

The extension shows you a notification every time a popup has been blocked and it even allows you to disable the popup blocker for five minutes.

Unfortunately this extension requires some broad permissions, but I can not change that as long Google Chrome doesn't have a real API for popup blocking. At the moment, I have to overwrite the popup-opening function on every single page that you look at. This extensions does nothing on sites that are using an encrypted HTTPS connection, so you don't have to trust me there. Moreover, I think it's less likely that encrypted sites would misuse popups.

## Installation

Get the extension from the [Downloads section](https://github.com/JannesMeyer/NoPop/downloads) or just use this link:

 - [NoPop 3.0](https://github.com/downloads/JannesMeyer/NoPop/NoPop%203.0.crx)

Coming soon: Chrome Web Store download link

## License

GPLv3

## Author

jannes.meyer (at) gmail (dot) com
