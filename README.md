# Video SDK video on demand react native api example

This code sample demonstrates a [Video SDK Video On Demand API](https://docs.videosdk.live/docs/guide/video-on-demand/getting-started) using react native.

- Built for serverless video on demand experience.
- Convert video from 240p to 4k.
- 98% device support.
- Low latecncy across the globe.
- Built for scale
- Adaptive video streaming
- Built for mobile devices


## Features

- [x] Upload large video files
- [x] Get video metadata in milliseconds.
- [x] Instant video encoding from 240p to 4k
- [x] Support multiple file and compression formats
- [x] Generate HD thumbnail images from video files.
- [x] Get notified when encoding is finished.
- [ ] protected video streaming
- [ ] 360 video support
- [ ] Embeded video players

## Prerequisites

You must have the following installed:

- Node JS
- NPM

## Getting started

1. Run the authentication server
   Follow [videosdk-rtc-nodejs-sdk-example](https://github.com/videosdk-live/videosdk-rtc-nodejs-sdk-example) to run authentication server.

2. Clone the repo

   ```sh
   git clone https://github.com/videosdk-live/videosdk-vod-react-native-api-example.git
   ```

3. Copy the `.env.example` file to `.env` file.

   ```sh
   cp .env.example .env
   ```

4. Update the api server url in the `.env` file that points to the authentication server.

   ```
   REACT_APP_SERVER_URL=http://localhost:9000
   ```

5. Install NPM packages

   ```sh
   npm install
   ```

6. Run the app

   ```sh
   npm run start
   npm android
   npm ios
   ```

For more information, visit [official documentation](https://docs.videosdk.live/docs/guide/video-on-demand/getting-started)
