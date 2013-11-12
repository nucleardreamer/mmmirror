mmmirror
======

mmmirror system
------

There are quite a lot of things that this project depends on. You will need to have sudo at least on your machine. I don't know how it will build on windows as of now.

You will need to have either some sort of TUIO device sending data to port 3333, or a touch device to use the UI, it is currently bound to hammer.js taps.

to install
`sudo apt-get install libasound2-dev`
`sudo npm install`

to run
`npm start`

todo
------
add stream buffer pausing, right now you have to kill the whole node process to stop tracks from playing