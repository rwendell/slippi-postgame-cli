# slippi-postgame-cli
a cli app that displays stats in the terminal after your match ends.

## Running
`./slippi-postgame`
Slippi Postgame will automatically listen at the default replay directory.  If you have another location you can supply that path with the `-p` flag.

## Configuration
slippi postgame will look for ~/.config/slippi-postgame/config.json. You can copy default-config.json here into that directory or use the command line argument
`./slippi-postgame -c /path/to/your/config/file`.  

## Building
`bun run build`
