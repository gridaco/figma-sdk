# Contributing

## The figma file key checksum logic

1. user copies the file url from the design file
2. 3rd party parses the file key from the url
3. 3rd party requests checksum of the file key to this service with
   - file key
   - the page ids of the file
   - the user's figma token for api access
4. this service looks up the file with the file key, checks if the file contains the same page info from the input.

## About the 3rd Party

The `3rd party` described above is your application, probably a figma plugin app.
From your figma plugin app, while requesting the checksum, you'll need to prompt user 2 data

- file key
- authentication to your figma app

This flow is implemented for production on [Grida Assistant](https://github.com/gridaco/assistant), you can see how it works.
